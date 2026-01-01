import { memo } from 'react';
import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes } from 'react';
import { cn } from '@/utils/lib';
import { Streamdown } from 'streamdown';
import { Avatar } from './Avatar';

import botImg from '@/assets/img/bot.jpeg';
import userImg from '@/assets/img/user.png';

export type MessageProps = {
  from: UIMessage['role'];
  avatar?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const Message = ({ from, avatar, className, children, ...props }: MessageProps) => {
  const isUser = from === 'user';
  const avatarSrc = isUser ? userImg : botImg;
  return (
    <div className={cn('group flex w-full max-w-[80%] gap-2', isUser ? 'is-user ml-auto justify-end' : 'is-assistant justify-start', className)} {...props}>
      {/* assistant 头像在左 */}
      {!isUser && avatar && <Avatar src={avatarSrc} />}

      {children}

      {/* user 头像在右 */}
      {isUser && avatar && <Avatar src={avatarSrc} />}
    </div>
  );
};

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;
export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      'w-fit max-w-full p-2 rounded-xl border border-gray-200 text-xs font-medium shadow-sm mb-3.5',

      'group-[.is-user]:ml-auto',

      'group-[.is-assistant]:bg-[#efefef]',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageResponseProps = ComponentProps<typeof Streamdown>;
export const MessageResponse = memo(
  ({ className, ...props }: MessageResponseProps) => {
    return (
      <Streamdown
        className={cn(
          'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
          // 代码块保持原样，但添加水平滚动
          '[&_pre]:overflow-x-auto [&_pre]:max-w-full',
          '[&_pre]:whitespace-pre [&_pre]:rounded-md [&_pre]:bg-gray-800 [&_pre]:text-gray-100',
          '[&_pre]:p-3 [&_pre]:text-xs [&_pre]:my-2',
          // 内联代码
          '[&_code:not(pre_code)]:bg-gray-200 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5',
          '[&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:text-xs',
          // 段落间距
          '[&_p]:my-2 [&_p]:leading-relaxed',
          // 标题间距
          '[&_h1]:text-base [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
          '[&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-2',
          '[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1',
          '[&_h4]:text-sm [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1',
          // 列表间距
          '[&_ul]:my-2 [&_ul]:pl-4 [&_ul]:list-disc',
          '[&_ol]:my-2 [&_ol]:pl-4 [&_ol]:list-decimal',
          '[&_li]:my-1',
          // 引用块
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:italic',
          // 普通文本换行
          'wrap-break-word overflow-wrap-anywhere',

          className
        )}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => {
    return prevProps.children === nextProps.children;
  }
);
MessageResponse.displayName = 'MessageResponse';
