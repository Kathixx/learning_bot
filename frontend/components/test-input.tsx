"use client"
import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form"
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
import { useTranslations } from 'next-intl';


type QA = {
  Question: string;
  Answer: string;
};

type Props = {
  currentQA: QA;
  setQA: React.Dispatch<React.SetStateAction<QA>>;
};

export function TestInput({setQA, currentQA}: Props) {

  const ctx = useTestContext();
  if (!ctx) throw new Error("Must be used inside <MessageProvider>");
  const { addMessage, returnJsonMsg } = ctx;
  
  const t = useTranslations('TestBot')
  
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

  async function checkAnswer(values: { message: string }) {
    const questionId = uuidv4()
    addMessage({id:questionId, text: values.message, sender:"user"})
    form.reset()
    await getAutoResponse()
    const updatedQA = {
      ...currentQA,
      Answer: values.message
    }
    setQA(updatedQA)
    const jsonData = JSON.stringify(updatedQA)
    const url = "http://localhost:5002/checkAnswer"
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
        const checkId = uuidv4()
        addMessage({id:checkId, text: response.Check, sender:"bot"})
        addMessage(returnJsonMsg('call_to_new_action'))
      })
  }

  return (
    <div className="h-full">
      <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(checkAnswer)} 
        className="flex h-full rounded-[20px] bg-background my-shadow px-5">
        <div className="flex-1">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="h-full">
                <FormControl>
                  <Textarea 
                    className="border-none focus-visible:ring-[0px] h-full resize-none pt-3 "  
                    placeholder={t('placeholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="self-end" type="submit" variant="ghost" size="icon"><IconSend2></IconSend2></Button>
      </form>
    </Form>
    </div>
  )
}

    

