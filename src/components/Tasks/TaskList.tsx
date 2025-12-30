import React, { useRef, useEffect, useState } from 'react';
import { Checkbox, Menu, Tooltip, Text } from '@mantine/core';
import { Ellipsis } from 'lucide-react';
// import { , Button, Text } from '@mantine/core';

import type { TaskItem, TaskEventType } from '@/types/task';

interface CheckboxLabelProps {
  item: TaskItem;
}
const CheckboxLabel: React.FC<CheckboxLabelProps> = ({ item }) => {
  return (
    <Tooltip
      label={
        <Text size="xs" lh={1.4}>
          {item.content}
        </Text>
      }
      position="top-start"
      withArrow
      disabled={item.content.length < 20}
    >
      <div className={`max-w-55 overflow-hidden text-ellipsis whitespace-nowrap ${item.done ? 'line-through opacity-50' : ''}`}>{item.content}</div>
    </Tooltip>
  );
};

interface TaskListProps {
  tasks: TaskItem[];
  handleTask: (type: TaskEventType, id: string) => void;
}
const TaskList: React.FC<TaskListProps> = ({ tasks, handleTask }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [tasks.length]); // 监听长度变化即可

  const [openedId, setOpenedId] = useState<string | null>(null);

  return (
    <div className="max-h-40 overflow-scroll min-h-30" ref={listRef}>
      {tasks.map((item: TaskItem) => {
        const isMenuOpen = openedId === item.id;
        return (
          <div className={`group flex items-center justify-between cursor-pointer transition-all duration-300 hover:bg-cyan-50 p-1.5 rounded-md ${isMenuOpen ? 'bg-cyan-50' : ''}`}>
            <Checkbox onChange={() => handleTask('done', item.id)} key={item.id} checked={item.done} label={<CheckboxLabel item={item} />} color="cyan" size="xs" />
            <Menu shadow="md" width={100} opened={isMenuOpen} onChange={open => setOpenedId(open ? item.id : null)}>
              <Menu.Target>
                <Ellipsis
                  onClick={e => e.stopPropagation()}
                  size={18}
                  className={`
                    mr-2 cursor-pointer transition-all duration-300
                    ${isMenuOpen ? 'text-black/80' : 'text-black/0 group-hover:text-black/80'}
                  `}
                />
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={e => {
                    e.stopPropagation(); // 防止触发父 div 的 onToggle
                    // editTask(item.id);
                    handleTask('edit', item.id);
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  onClick={e => {
                    e.stopPropagation(); // 同样阻止冒泡
                    handleTask('del', item.id);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        );
      })}
    </div>
  );
};

export default TaskList;
