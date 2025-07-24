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
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="w-full max-h-[82%] h-[82%] overflow-y-auto px-5 pt-[100px]">
        <MessageList messages={messages}></MessageList>
      </div>
      <div className=" w-[50%] px-5 bottom-10 absolute">
        <LearnInput></LearnInput>
        <p className="text-right text-xs px-5 italic py-1">{t('warning')}</p>
      </div>
    </div>
  )
}

    

