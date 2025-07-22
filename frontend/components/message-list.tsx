"use client"

import { useEffect, useRef } from "react"
import { MessageType } from "@/types/message"
import { MessageItem } from "@/components/message-item"

type MessageListProps = {
  messages: MessageType[];
};

export function MessageList({ messages }: MessageListProps){

  const bottomRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  return (
    <div>
      {messages.map((m) => (
        <MessageItem key={m.id} sender={m.sender} text={m.text}>
        </MessageItem>
      ))}
      <div ref={bottomRef}></div>

    </div>
  );
};


    

