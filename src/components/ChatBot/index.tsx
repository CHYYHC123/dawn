import { Menu, Text, Divider } from '@mantine/core';
import { useEffect, useState } from 'react';

import { Conversation, ConversationContent, ConversationScrollButton } from '@/components/ChatBot/Conversation';

import { Message, MessageContent, MessageResponse } from '@/components/ChatBot/Message';

import botImg from '@/assets/img/bot.jpeg';

import { PromptInputBody, PromptInputTextarea, PromptInputFooter, PromptInputSubmit } from './PromptInput';

import { DefaultChatTransport } from 'ai';
import type { ChatTransport, UIMessage } from 'ai';
import { useChat } from '@ai-sdk/react';

const ChatBot = () => {
  const [input, setInput] = useState('');
  // 配置请求接口
  const transport: ChatTransport<UIMessage> = new DefaultChatTransport({
    api: 'https://ai-assistant-mu-murex.vercel.app/api/article'
  });
  const { messages, sendMessage, status, regenerate, setMessages } = useChat({
    transport
  });

  console.log('messages', messages);
  const handleClick = () => {
    console.log('input', input);
    if (!input) return;
    sendMessage({
      text: input?.trim(),
      files: []
    });
    setInput('');
  };

  // useEffect(() => {
  //
  //   sendMessage({
  //     text: `hi`,
  //     files: []
  //   });
  // }, []);
  // const handleSubmit = (message: PromptInputMessage) => {
  //   const hasText = Boolean(message.text);
  //   const hasAttachments = Boolean(message.files?.length);
  //   if (!(hasText || hasAttachments)) return;

  //   sendMessage(
  //     {
  //       text: message.text || 'Sent with attachments',
  //       files: message.files
  //     },
  //     {
  //       body: {
  //         model: model,
  //         webSearch: webSearch
  //       }
  //     }
  //   );
  //   setInput('');
  // };
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
          <div className="bg-white border border-gray-200 rounded-2xl">
            <PromptInputBody className="text-xs">
              <PromptInputTextarea onChange={e => setInput(e.target.value)} value={input} />
            </PromptInputBody>
            <PromptInputFooter className="pt-0">
              <div></div>
              <PromptInputSubmit onClick={handleClick} className="cursor-pointer bg-gray-200 rounded-2xl" disabled={!input && !status} status={status} />
            </PromptInputFooter>
          </div>
        </div>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChatBot;
