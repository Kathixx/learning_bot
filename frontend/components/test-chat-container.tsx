"use client"

import { MessageList } from "@/components/message-list"
import { useTranslations } from 'next-intl';
import { useTestContext } from "@/app/[locale]/protected/testing/page";

export function TestChatContainer() {

  const ctx = useTestContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { messages } = ctx;

  const t = useTranslations('Chat');

 

  return (
    <div className="w-full h-full overflow-hidden pt-[100px] pb-[20px] pr-4 pl-2">
      <div className="flex h-full flex-col relative overflow-hidden bg-background rounded-lg p-5">
        <p className="absolute right-2 text-xs px-5 italic">{t('warning')}</p>
        <div className="w-full overflow-y-auto pb-[20px] pt-5">
          <MessageList messages={messages}></MessageList>
        </div>
      </div>
    </div>
  )
}

    

