import { Menu, Text, Divider } from '@mantine/core';
import { useState } from 'react';
import { env } from '@/config/env';

import { useChat } from '@ai-sdk/react';

import { DefaultChatTransport } from 'ai';
import type { ChatTransport, UIMessage } from 'ai';

import botImg from '@/assets/img/bot.jpeg';

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ChatBot/Conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ChatBot/Message';

import { PromptInput, PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputSubmit, type PromptInputMessage } from './PromptInput';

import { useTodayArticle } from '@/components/ChatBot/hooks/useTodayArticle';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const { todayArticle } = useTodayArticle();

  const transport: ChatTransport<UIMessage> = new DefaultChatTransport({
    api: `${env.AI_API_LOCAL}/api/article`
  });
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: err => {
      console.log('useChat 请求错误:', err);
    }
  });
  const handleClick = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);
    if (!(hasText || hasAttachments)) return;
    sendMessage({
      text: message.text || 'Sent with attachments',
      files: message.files
    });
    setInput('');
  };

  /** 将今日面试题发送给 AI 格式化 */
  const sendTodayArticle = () => {
    if (!todayArticle) return;
    const text = `<h2>${todayArticle.rawTitle}</h2>\n${todayArticle.contentHtml}`;
    sendMessage({ text, files: undefined });
  };

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
              {messages.map(message => {
                return (
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
                );
              })}
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
              <button
                type="button"
                onClick={sendTodayArticle}
                disabled={!todayArticle || status === 'streaming'}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                今日面试题
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
