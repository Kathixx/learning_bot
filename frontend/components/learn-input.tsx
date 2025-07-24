"use client"
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form"
import { useLearnContext } from "@/app/[locale]/protected/learning/page"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { IconSend2 } from "@tabler/icons-react"
import { useTranslations } from 'next-intl'



export function LearnInput() {
  
  const t = useTranslations('Chat')

  const ctx = useLearnContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { addMessage, returnJsonMsg } = ctx;

  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
  


  async function getAutoResponse(){
    addMessage(returnJsonMsg('thinking_response'))
    await delay(Math.random() * (2000 - 5000) + 5000)
  }

   async function getAnswer(values: { message: string }) {
      const questionId = uuidv4()
      addMessage({id:questionId, text: values.message, sender:"user"})
      form.reset()
      await getAutoResponse()
      const jsonData = JSON.stringify({question: values.message})
      console.log("i will send this question: ", jsonData)
      const url = "http://localhost:5002/getAnswer"
      fetch(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: jsonData,
      })
      .then((response) => response.json())
        .then((response) => {
          const answerId = uuidv4()
          addMessage({id:answerId, text: response.Answer, sender:"bot"})
          addMessage(returnJsonMsg('call_to_new_action'))
        })
  }
  

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(getAnswer)} 
        className="flex h-1/5 rounded-lg bg-background  px-5">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormControl>
                  <Textarea 
                    className="border-none focus-visible:ring-[0px] h-full resize-none pt-3 " 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(getAnswer)();   
                      }
                    }} 
                    placeholder={t('placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="self-end bg-secondary rounded-full text-light mb-5" type="submit" variant="ghost" size="icon"><IconSend2></IconSend2></Button>
      </form>
    </Form>
  )
}

    

