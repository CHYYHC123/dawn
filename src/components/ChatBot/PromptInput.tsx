import { useState } from 'react';
import type { ComponentProps, KeyboardEventHandler, ClipboardEventHandler, ChangeEvent, HTMLAttributes, FormEvent } from 'react';
import type { ChatStatus, FileUIPart } from 'ai';

import InputGroupTextarea from '@/components/common/InputGroupTextarea';
import InputGroupButton from '@/components/common/InputGroupButton';
import { InputGroupAddon } from '@/components/common/InputGroup';

import { cn } from '@/utils/lib';
import { CornerDownLeftIcon, ImageIcon, Loader2Icon, MicIcon, PaperclipIcon, PlusIcon, SquareIcon, XIcon } from 'lucide-react';

// 输入框
export type PromptInputTextareaProps = ComponentProps<typeof InputGroupTextarea>;

export const PromptInputTextarea = ({ onChange, className, placeholder = 'What would you like to know?', ...props }: PromptInputTextareaProps) => {
  // const controller = useOptionalPromptInputController();
  const controller: any = false;
  // const attachments = usePromptInputAttachments();
  // 附件提示词暂时没用到
  const attachments: any = {};
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = e => {
    if (e.key === 'Enter') {
      if (isComposing || e.nativeEvent.isComposing) return;
      // 允许 Shift + Enter 换行
      if (e.shiftKey) return;
      e.preventDefault();
      // 提交前请检查提交按钮是否被禁用
      const form = e.currentTarget.form;
      const submitButton = form?.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      if (submitButton?.disabled) return;
      form?.requestSubmit();
    }
    // 当按下退格键且文本区域为空时，删除最后一个附件
    if (e.key === 'Backspace' && e.currentTarget.value === '' && attachments?.files.length > 0) {
      e.preventDefault();
      const lastAttachment = attachments.files.at(-1);
      if (lastAttachment) attachments.remove(lastAttachment.id);
    }
  };
  const handlePaste: ClipboardEventHandler<HTMLTextAreaElement> = event => {
    const items = event.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      event.preventDefault();
      attachments.add(files);
    }
  };
  const controlledProps = controller
    ? {
        value: controller.textInput.value,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          controller.textInput.setInput(e.currentTarget.value);
          onChange?.(e);
        }
      }
    : { onChange };

  return (
    <InputGroupTextarea
      className={cn('field-sizing-content max-h-48 min-h-16', className)}
      name="message"
      onCompositionEnd={() => setIsComposing(false)}
      onCompositionStart={() => setIsComposing(true)}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      placeholder={placeholder}
      {...props}
      {...controlledProps}
    />
  );
};

export type PromptInputBodyProps = HTMLAttributes<HTMLDivElement>;
export const PromptInputBody = ({ className, ...props }: PromptInputBodyProps) => <div className={cn('contents', className)} {...props} />;

export type PromptInputMessage = {
  text: string;
  files: FileUIPart[];
};

export type PromptInputProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit' | 'onError'> & {
  accept?: string; // e.g., "image/*" or leave undefined for any
  multiple?: boolean;
  // When true, accepts drops anywhere on document. Default false (opt-in).
  globalDrop?: boolean;
  // Render a hidden input with given name and keep it in sync for native form posts. Default false.
  syncHiddenInput?: boolean;
  // Minimal constraints
  maxFiles?: number;
  maxFileSize?: number; // bytes
  onError?: (err: { code: 'max_files' | 'max_file_size' | 'accept'; message: string }) => void;
  onSubmit: (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};
export const PromptInput = ({ className, accept, multiple, globalDrop, syncHiddenInput, maxFiles, maxFileSize, onError, onSubmit, children, ...props }: PromptInputProps) => {};

// 提交按钮
export type PromptInputSubmitProps = ComponentProps<typeof InputGroupButton> & {
  status?: ChatStatus;
};
export const PromptInputSubmit = ({ className, variant = 'default', size = 'icon-sm', status, children, ...props }: PromptInputSubmitProps) => {
  let Icon = <CornerDownLeftIcon className="size-4" />;
  if (status === 'submitted') {
    Icon = <Loader2Icon className="size-4 animate-spin" />;
  } else if (status === 'streaming') {
    Icon = <SquareIcon className="size-4" />;
  } else if (status === 'error') {
    Icon = <XIcon className="size-4" />;
  }
  return (
    <InputGroupButton aria-label="Submit" className={cn(className)} size={size} type="submit" variant={variant} {...props}>
      {children ?? Icon}
    </InputGroupButton>
  );
};

export type PromptInputFooterProps = Omit<ComponentProps<typeof InputGroupAddon>, 'align'>;
export const PromptInputFooter = ({ className, ...props }: PromptInputFooterProps) => <InputGroupAddon align="block-end" className={cn('justify-between gap-1', className)} {...props} />;
