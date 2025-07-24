"use client"

import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { MessageList } from "@/components/message-list"

export function TestChatContainer() {

  const ctx = useTestContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { messages } = ctx;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full overflow-y-auto px-5 pt-[100px] pb-[20px]">
        <p className="text-right text-xs px-5 italic py-1">KI kann Fehler machen.</p>
        <MessageList messages = {messages}></MessageList>
      </div>
    </div>
  )
}

    

