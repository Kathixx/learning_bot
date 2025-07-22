"use client"
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageType } from "@/types/message"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import responses from "@/data/random_chatbot_responses.json"
import { IconSend2 } from "@tabler/icons-react"
import { useTranslations } from 'next-intl';



type ChatInputProps = {
  onSend: (message: MessageType) => void;
};


export function ChatInput({onSend}:ChatInputProps) {
  
  const t = useTranslations('Chat')
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
  
  function getRandomNumber(){
    return Math.floor(Math.random() * responses.answers.length)
  }

  async function getAutoResponse(){
    let randomNumber = getRandomNumber()
    const thinkingId = uuidv4()
    onSend({id:thinkingId, text: responses.answers[randomNumber].thinking_response, sender:"bot"})
    await delay(Math.random() * (2000 - 5000) + 5000)
    randomNumber = getRandomNumber()
    const responseId = uuidv4()
    onSend({id:responseId, text: responses.answers[randomNumber].final_response, sender:"bot"})
    console.log("counts:" +responseId)
  }

  function onSubmit(values: { message: string }) {
    const questionId = uuidv4()
    onSend({id:questionId, text: values.message, sender:"user"})
    console.log("counts:" +questionId)
    form.reset()
    getAutoResponse()
  }

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="w-full flex items-center justify-between rounded-full bg-background my-shadow h-auto px-5">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    className="border-none focus-visible:ring-[0px] resize-none pt-3 " 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();   
                      }
                    }} 
                    placeholder={t('placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="ghost" size="icon"><IconSend2></IconSend2></Button>
      </form>
    </Form>
  )
}

    

