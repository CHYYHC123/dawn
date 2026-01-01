import { useCallback } from 'react';
import type { ComponentProps } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import { ArrowDownIcon } from 'lucide-react';

import { Button } from '@/components/common/button';

import { cn } from '@/utils/lib';

export type ConversationProps = ComponentProps<typeof StickToBottom>;
export const Conversation = ({ className, ...props }: ConversationProps) => <StickToBottom className={cn('relative h-full overflow-x-hidden', className)} initial="smooth" resize="smooth" role="log" {...props} />;

export type ConversationContentProps = ComponentProps<typeof StickToBottom.Content>;
export const ConversationContent = ({ className, ...props }: ConversationContentProps) => <StickToBottom.Content className={cn('flex flex-col gap-4 overflow-x-hidden', className)} {...props} />;

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({ className, ...props }: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);
  return (
    !isAtBottom && (
      <Button className={cn('absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full bg-white border border-gray-300 cursor-pointer w-8 h-8', className)} onClick={handleScrollToBottom} size="icon" type="button" variant="outline" {...props}>
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
