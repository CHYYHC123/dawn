import { Menu, Text, Divider } from '@mantine/core';
import { useMemo, useState } from 'react';
import { env } from '@/config/env';

import { useChat } from '@ai-sdk/react';

import { DefaultChatTransport } from 'ai';
import type { ChatTransport, UIMessage } from 'ai';

import botImg from '@/assets/img/bot.jpeg';

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ChatBot/Conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ChatBot/Message';

import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputSubmit, type PromptInputMessage } from './PromptInput';

import { useTodayArticle } from '@/components/ChatBot/hooks/useTodayArticle';
import { AGENT } from '@/api/index';

/** 从 useChat onError 中解析出的错误信息 */
type ChatError = { code: number; message: string };

/** 解析 useChat 抛出的错误（支持对象形式或 Error.message 中的 code/message） */
function parseChatError(err: unknown): ChatError | null {
  if (err != null && typeof err === 'object' && 'code' in err && 'message' in err) {
    const code = Number((err as { code: unknown }).code);
    const message = String((err as { message: unknown }).message);
    if (!Number.isNaN(code) && message) return { code, message };
  }
  if (err instanceof Error && err.message) {
    const msg = err.message;
    const objMatch = msg.match(/\{\s*code:\s*(\d+)\s*,\s*message:\s*(.+)\s*\}/);
    if (objMatch) {
      return { code: Number(objMatch[1]), message: objMatch[2].trim() };
    }
    return { code: -1, message: msg };
  }
  if (err != null) return { code: -1, message: String(err) };
  return null;
}

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [lastError, setLastError] = useState<ChatError | null>(null);
  const { todayArticle } = useTodayArticle();

  const transport: ChatTransport<UIMessage> = new DefaultChatTransport({
    api: AGENT.article
  });
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: err => {
      const parsed = parseChatError(err);
      if (parsed) setLastError(parsed);
    }
  });
  const handleClick = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) return;
    setLastError(null);
    sendMessage({
      text: message.text || 'Sent with attachments',
      files: message.files
    });
    setInput('');
  };

  /** 将今日面试题发送给 AI 格式化（该条用户消息在界面不展示，仅用于请求） */
  const sendTodayArticle = () => {
    if (!todayArticle) return;
    setLastError(null);
    const text = `start flag: 将这段 <h2 class="article-viewer">${todayArticle.rawTitle}</h2>\n${todayArticle.contentHtml} 内容转换为 Markdown 格式`;
    sendMessage({ text, files: undefined });
  };

  /** 识别「今日面试题转 Markdown」的用户消息，不在界面展示 */
  const isTodayArticlePromptMessage = (message: UIMessage) => {
    if (message.role !== 'user') return false;
    const textContent = message.parts
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map(p => p.text)
      .join('');
    return textContent.startsWith('start flag: 将这段 ');
  };

  /** 单独维护的展示用消息列表（过滤隐藏项），随 useChat.messages 更新以支持流式输出 */
  const displayMessages = useMemo(() => messages.filter(m => !isTodayArticlePromptMessage(m)), [messages]);

  return (
    <Menu shadow="md" width={375} position="top-end" offset={10} arrowOffset={25} radius="lg" withArrow>
      <Menu.Target>
        <div className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center mr-3 cursor-pointer transition-transform">
          <img src={botImg} alt="Chat Bot" className="w-13 h-13 object-cover" />
        </div>
      </Menu.Target>

      <Menu.Dropdown style={{ background: '#f8f6f5', padding: '0' }}>
        {/* Header */}
        <div className="px-4 py-3">
          <Text size="lg" fw={700} className="text-gray-800">
            AI Assistant
          </Text>
        </div>

        <Divider />

        {/* Message */}
        <div style={{ height: '300px' }}>
          <Conversation className="h-full p-2">
            <ConversationContent>
              {displayMessages.map(message => (
                <div key={message.id}>
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <Message key={`${message.id}-${i}`} from={message.role} avatar={true}>
                            <MessageContent>
                              <MessageResponse>{part.type === 'text' ? part.text : ''}</MessageResponse>
                            </MessageContent>
                          </Message>
                        );
                      case 'reasoning':
                        return null;
                      default:
                        return null;
                    }
                  })}
                </div>
              ))}
              {lastError && (
                <Message key="chat-error" from="system" avatar={true}>
                  <MessageContent>
                    <MessageResponse>{`[系统] 请求失败（${lastError.code}）：${lastError.message}`}</MessageResponse>
                  </MessageContent>
                </Message>
              )}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
        </div>

        {/* footer */}
        <div className="p-3 pt-0">
          {/* <div className="bg-white border border-gray-200 rounded-2xl"> */}
          <PromptInput onSubmit={handleClick}>
            <PromptInputBody className="text-xs">
              <PromptInputTextarea onChange={e => setInput(e.target.value)} value={input} />
            </PromptInputBody>
            <PromptInputFooter className="pt-0">
              <button type="button" onClick={sendTodayArticle} disabled={!todayArticle || status === 'streaming'} className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50">
                每日一题
              </button>
              <PromptInputSubmit className="cursor-pointer bg-gray-200 rounded-2xl" disabled={!input && !status} status={status} />
            </PromptInputFooter>
          </PromptInput>
        </div>
        {/* </div> */}
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChatBot;
