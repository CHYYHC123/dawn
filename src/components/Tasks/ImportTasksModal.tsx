import { Modal, Stack, Text, Group, Button } from '@mantine/core';

import CodePreview from '@/components/common/CodePreview';

interface ImportTasksModalProps {
  opened: boolean;
  onClose: () => void;
  onUpload: () => void;
}

// 示例数据
const exampleJSON = `{
  "type": "tasks",
  "data": [
    { "content": "Task 1", "done": false },
    { "content": "Task 2", "done": true }
  ]
}`;

const ImportTasksModal: React.FC<ImportTasksModalProps> = ({ opened, onClose, onUpload }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Import tasks" radius="lg" centered>
      <Stack gap="sm">
        <Text size="sm" c="dimmed">
          Please upload a JSON file with the following structure:
        </Text>

        <CodePreview label="JSON" value={exampleJSON} />

        <Text size="xs" c="dimmed">
          Task IDs will be generated automatically during import.
        </Text>

        {/* Actions */}
        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onUpload}>Upload JSON</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImportTasksModal;
