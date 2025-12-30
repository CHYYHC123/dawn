import { KeyboardEvent, useEffect, useState } from 'react';

import { Menu, Button, Modal, Text, Group, Checkbox } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import { Check } from 'lucide-react';

import Input from '@/components/common/input';
import TaskList from './TaskList';
import MenuList from './MenuList';
import ImportTasksModal from './ImportTasksModal';

import type { TaskItem, TaskEventType } from '@/types/task';

import { getAllTasks, saveTasks } from '@/utils/idb';
import { downloadJSON } from '@/utils/download';

import pkg from '@/../package.json';

const Tasks: React.FC = () => {
  const [opened, setOpened] = useState(false);

  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  const [newTask, setNewTask] = useState<string>('');
  const [editing, setEditing] = useState<TaskItem | null>(null);

  const handleTaskChange = (type: TaskEventType, id: string) => {
    if (type === 'done') {
      setTaskList(prev => prev.map(task => (task.id === id ? { ...task, done: !task.done } : task)));
    } else if (type === 'del') {
      setTaskList(prev => prev.filter(task => task.id !== id));
    } else if (type === 'edit') {
      const needEditTask = taskList.find(task => task.id === id) || null;
      console.log('needEditTask', needEditTask);
      setNewTask(needEditTask?.content || '');
      setEditing(needEditTask);
    }
  };

  // 单个添加任务
  const [add, setAdd] = useState(false);
  const addTask = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const value = event.currentTarget.value.trim();
    if (!value) return;

    setTaskList(prev => {
      // 编辑模式
      if (editing?.id) {
        return prev.map(task => (task.id === editing.id ? { ...task, content: value } : task));
      }
      // 新增模式
      return [
        ...prev,
        {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          content: value,
          done: false
        }
      ];
    });

    // 清空输入框
    event.currentTarget.value = '';
    setNewTask('');
    setEditing(null); // 编辑结束（可选）
  };

  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    getAllTasks().then(tasks => {
      setTaskList(tasks || []);
      setInitialized(true);
    });
  }, []);

  // taskList 每次变化 → 保存到 IndexedDB
  useEffect(() => {
    // 初始化前不要保存，否则会覆盖 DB 中的数据
    if (!initialized) return;
    // 允许保存空数组
    saveTasks(taskList);
  }, [taskList, initialized]);

  // 导出所有任务
  const handleExport = () => {
    if (!taskList.length) {
      notifications.show({
        color: 'yellow',
        title: 'No tasks to export',
        message: 'Your task list is currently empty.'
      });
      return;
    }
    const payload = {
      version: pkg?.version || '1',
      type: 'tasks',
      exportedAt: new Date().toISOString(),
      data: taskList
    };
    const result = downloadJSON(payload, 'dawn-tasks.json');
    if (!result) {
      notifications.show({
        color: 'red',
        title: 'No tasks to export',
        message: 'Your task list is currently empty.'
      });
    }
  };

  // 导入任务
  const [importOpen, setImportOpen] = useState(false);
  const handleImport = () => {
    setImportOpen(true);
  };
  const importTasksFromFile = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      console.log('input', input);
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return;

        const text = await file.text();
        const payload = JSON.parse(text);

        // 1️⃣ 基础结构校验
        if (payload?.type !== 'tasks' || !Array.isArray(payload?.data)) {
          notifications.show({
            color: 'red',
            message: 'Invalid task file.'
          });
          return;
        }
        if (!payload.data.length) {
          notifications.show({
            color: 'yellow',
            message: 'No tasks found in file.'
          });
          return;
        }
        // 3️⃣ 合并当前任务
        setTaskList(prev => {
          const merged = mergeTasks(prev, payload.data);

          notifications.show({
            color: 'green',
            message: `Imported ${merged.length - prev.length} new tasks.`
          });

          return merged;
        });

        setImportOpen(false);
      };
      input.click();
    } catch (err) {
      notifications.show({
        color: 'red',
        message: 'Failed to import tasks.'
      });
    }
  };
  const mergeTasks = (current: TaskItem[], imported: TaskItem[]): TaskItem[] => {
    const existingContentSet = new Set(current.map(t => t.content.trim()));

    const newTasks: TaskItem[] = imported
      .filter(t => t?.content && !existingContentSet.has(t.content.trim()))
      .map(t => ({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        content: t.content,
        done: Boolean(t.done)
      }));

    return [...current, ...newTasks];
  };

  // 删除所有任务
  const [clearOpen, setClearOpen] = useState(false);
  const [onlyCompleted, setOnlyCompleted] = useState(false);
  const handleClear = () => {
    if (!taskList.length) {
      notifications.show({
        color: 'yellow',
        message: 'No tasks to clear.'
      });
      return;
    }

    setClearOpen(true);
  };
  const confirmClear = () => {
    setTaskList(prev => {
      if (onlyCompleted) {
        return prev.filter(task => !task.done);
      }
      return [];
    });

    notifications.show({
      color: 'green',
      message: onlyCompleted ? 'Completed tasks cleared.' : 'All tasks have been cleared.'
    });

    setOnlyCompleted(false);
    setClearOpen(false);
  };

  return (
    <>
      <Menu shadow="md" width={350} position="bottom-end" radius="lg" withArrow arrowOffset={20} opened={opened} onChange={setOpened} closeOnClickOutside={false}>
        <Menu.Target>
          <div className="flex flex-col items-center justify-center gap-2 select-none cursor-pointer">
            <div className="w-8 h-8 p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <Check size={18} strokeWidth={3} className="text-white" />
            </div>
            <span className="text-white text-base font-semibold">Tasks</span>
          </div>
        </Menu.Target>
        <Menu.Dropdown>
          <div className="p-2">
            <div className="flex items-center justify-between pb-5 group">
              <span className="text-xl font-medium">Task</span>
              <MenuList onImport={handleImport} onExport={handleExport} onClear={handleClear} />
            </div>
            {taskList?.length ? (
              <div className="pl-2">
                <TaskList tasks={taskList} handleTask={handleTaskChange} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 ">
                <div className="text-xl font-medium text-black/45">Add a task to get started</div>
                <div className="text-black/40 cursor-pointer hover:text-black/60 transition-all duration-300 ease-in-out">Switch to Inbox →</div>
              </div>
            )}

            {!add && !taskList.length ? (
              <div className="flex flex-col items-center py-5">
                <Button
                  radius="lg"
                  color="cyan"
                  onClick={() => {
                    setAdd(true);
                  }}
                >
                  New Task
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center mt-2 text-sm">
                <Input
                  value={newTask}
                  type="text"
                  autoFocus
                  placeholder="New Task"
                  className="text-xs bg-transparent text-black  border-0 border-transparent focus:ring-2 focus:ring-transparent"
                  onKeyDown={addTask}
                  onChange={e => {
                    setNewTask(e.currentTarget?.value);
                  }}
                />
              </div>
            )}
          </div>
        </Menu.Dropdown>
      </Menu>

      <ImportTasksModal opened={importOpen} onClose={() => setImportOpen(false)} onUpload={importTasksFromFile} />

      <Modal opened={clearOpen} onClose={() => setClearOpen(false)} title="Clear tasks?" centered radius="lg">
        <Text size="sm" c="dimmed">
          This action will permanently delete tasks and cannot be undone.
        </Text>

        <Text size="sm" c="dimmed" mt={4}>
          You may want to export your tasks first to keep a backup.
        </Text>

        <Checkbox mt="md" label="Only delete completed tasks" checked={onlyCompleted} onChange={e => setOnlyCompleted(e.currentTarget.checked)} />

        <Group justify="flex-end" mt="lg">
          <Button variant="default" onClick={() => setClearOpen(false)}>
            Cancel
          </Button>

          <Button color="red" onClick={confirmClear}>
            {onlyCompleted ? 'Clear completed' : 'Clear all'}
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default Tasks;
