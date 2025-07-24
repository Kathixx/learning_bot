"use client"

import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { MessageList } from "@/components/message-list"
import { useTranslations } from 'next-intl';


export function TestChatContainer() {
  const t = useTranslations('Chat');

  const ctx = useTestContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { messages } = ctx;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <p className="absolute right-2 text-xs px-5 italic pt-3">{t('warning')}</p>
      <div className="w-full overflow-y-auto px-5 pt-[100px] pb-[20px]">
        <MessageList messages = {messages}></MessageList>
      </div>
    </div>
  )
}

    

