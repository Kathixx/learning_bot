"use client"

import { MessageList } from "@/components/message-list"
import { LearnInput } from "@/components/learn-input"
import { useTranslations } from 'next-intl';
import { useLearnContext } from "@/app/[locale]/protected/learning/page";


export function LearnChatContainer() {

  const ctx = useLearnContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { messages } = ctx;


  const t = useTranslations('Chat')


  return (
     <div className="w-full h-full flex flex-col overflow-hidden pt-[100px] pb-[20px] pr-4 pl-2 gap-4">
      <div className="flex flex-1 overflow-y-auto relative bg-background rounded-lg p-5">
        <p className="absolute right-2 text-xs px-5 italic">{t('warning')}</p>
        <div className="w-full overflow-y-auto pb-[20px] pt-5">
          <MessageList messages={messages}></MessageList>
        </div>
      </div>
      <LearnInput></LearnInput>
    </div>
  )
}

    

