import { Menu } from '@mantine/core';
import { useState } from 'react';
import { Ellipsis, Upload, Download, Trash } from 'lucide-react';

interface MenuListProps {
  onImport?: () => void;
  onExport?: () => void;
  onClear?: () => void;
}
const MenuList: React.FC<MenuListProps> = ({ onImport, onExport, onClear }) => {
  const [opened, setOpened] = useState(false);

  const handleExport = () => {
    onExport?.();
    setOpened(false); // 👈 手动收起
  };

  const handleImport = () => {
    onImport?.();
    setOpened(false); // 👈 手动收起
  };

  const handleClear = () => {
    onClear?.()
    setOpened(false); // 👈 手动收起
  };

  return (
    <>
      <Menu opened={opened} onChange={setOpened} closeOnItemClick={false} shadow="md" width={180} position="bottom-end" radius="md" withArrow arrowOffset={12}>
        <Menu.Target>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-0 transition-all duration-200 ease-out hover:bg-neutral-200 cursor-pointer">
            <Ellipsis size={18} strokeWidth={2} className="text-neutral-700" />
          </div>
        </Menu.Target>

        <Menu.Dropdown>
          {onImport && (
            <Menu.Item leftSection={<Upload size={14} />} onClick={handleImport}>
              Import Tasks
            </Menu.Item>
          )}

          {onExport && (
            <Menu.Item leftSection={<Download size={14} />} onClick={handleExport}>
              Export Tasks
            </Menu.Item>
          )}

          {onClear && (
            <Menu.Item color="red" leftSection={<Trash size={14} />} onClick={handleClear}>
              Clear All
            </Menu.Item>
          )}
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default MenuList;
