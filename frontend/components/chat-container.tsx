"use client"

import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { MessageType } from "@/types/message"
import { useState } from "react"
import { useTranslations } from 'next-intl';


export function ChatContainer() {

const t = useTranslations('Chat')

const [messages, setMessages] = useState<MessageType[]>([]);

const addMessage = (newMessage: MessageType) => {
  setMessages(prev => [...prev, newMessage]);
};

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-h-[82%] h-[82%] overflow-y-auto px-5 pt-[100px]">
        <MessageList messages = {messages}></MessageList>
      </div>
      <div className=" w-[50%] px-5 bottom-10 absolute">
        <ChatInput onSend={addMessage}></ChatInput>
        <p className="text-right text-xs px-5 italic py-1">{t('warning')}</p>
      </div>
    </div>
  )
}

    

