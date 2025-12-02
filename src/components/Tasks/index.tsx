import { Check } from 'lucide-react';
import { KeyboardEvent, useEffect, useState } from 'react';
import { Menu, Button } from '@mantine/core';
import Input from '@/components/common/input';
import TaskList from './TaskList';
import type { TaskItem, TaskEventType } from '@/types/task';

import { getAllTasks, saveTasks } from '@/utils/idb';

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
          id: Date.now().toString(),
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

  return (
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
          <div className="flex items-center justify-between pb-5">
            <span className="text-xl font-medium">Task</span>
            {/* <span>...</span> */}
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
  );
};

export default Tasks;
