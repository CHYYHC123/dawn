import { Code, CopyButton, Tooltip, ActionIcon } from '@mantine/core';
import { Check, Copy } from 'lucide-react';

interface CodePreviewProps {
  value: string;
  label?: string; // e.g. JSON
}

const CodePreview: React.FC<CodePreviewProps> = ({ value, label = 'Code' }) => {
  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 text-xs text-neutral-600 border-b border-neutral-200">
        <span className="font-medium">{label}</span>

        <CopyButton value={value} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow>
              <ActionIcon size="xs" variant="subtle" onClick={copy}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>

      {/* Code */}
      <Code block className="rounded-none border-0 bg-transparent">
        {value}
      </Code>
    </div>
  );
};

export default CodePreview;
