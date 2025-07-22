"use client"
import { v4 as uuidv4 } from 'uuid';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageType } from "@/types/message"
import React, { useState, useEffect } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import responses from "@/data/random_chatbot_responses.json"
import { IconSend2 } from "@tabler/icons-react"
// import { useTranslations } from 'next-intl';



type TestInputProps = {
  onSend: (message: MessageType) => void;
};


export function TestInput({onSend}:TestInputProps) {


  
  // const t = useTranslations('Chat')
  const form = useForm({
    defaultValues: {
      message: "",
    },
  });

  const [showInput, setShowInput] = useState(false);


  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
  
  useEffect(() => {
    // Your custom function
    getWelcomeMessages();
  }, []);

  async function getWelcomeMessages() {
    onSend(returnJsonMsg('welcome_message'))
    await delay(Math.random() * (2000 - 5000) + 5000)
     onSend(returnJsonMsg('ready_message'))
  }

  function getRandomNumber(){
    return Math.floor(Math.random() * responses.answers.length)
  }

  async function getAutoResponse(){
    await delay(Math.random() * (2000 - 5000) + 5000)
    onSend(returnJsonMsg('thinking_response'))}

  function onSubmit(values: { message: string }) {
    const questionId = uuidv4()
    onSend({id:questionId, text: values.message, sender:"user"})
    console.log("counts:" +questionId)
    form.reset()
    getAutoResponse()
  }

  async function startTest() {
    const randomNumber = getRandomNumber()
    const waitingId = uuidv4()
    onSend({id:waitingId, text: responses.answers[randomNumber].waiting_message, sender:"bot"})
    setShowInput(true)
    const url = "http://localhost:5002/getQuestion";
    // Fetch request to the Flask backend
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET"
    })
      .then((response) => response.json())
      .then((response) => {
        const responseId = uuidv4()
        onSend({id:responseId, text: response.Question, sender:"bot"})
        // await delay(Math.random() * (2000 - 5000) + 5000)
        onSend(returnJsonMsg('call_to_action'))
      })
  }

  function returnJsonMsg (
  msgType: 'waiting_message' | 'thinking_response' | 'ready_message' | 'welcome_message' | 'call_to_action',
  sender: 'user' | 'bot' = 'bot'
): MessageType{
    const currentId = uuidv4()
    const randomNumber = getRandomNumber()
    let currentMsg = ''

    switch (msgType) {
      case 'waiting_message':
        currentMsg = responses.answers[randomNumber].waiting_message
        break;
      case 'thinking_response':
        currentMsg = responses.answers[randomNumber].thinking_response;
        break;
      case 'ready_message':
        currentMsg = responses.answers[randomNumber].ready_message;
        break;
      case 'welcome_message':
        currentMsg = responses.answers[randomNumber].welcome_message;
        break;
      case 'call_to_action':
        currentMsg = responses.answers[randomNumber].call_to_action;
        break;
      default:
        currentMsg = 'Unknown message type';
    }
    return {
    id: currentId,
    text: currentMsg,
    sender: sender,
  };
  
  }
  

  return (
    <div>
    {showInput ? 
      ( <Form {...form}>
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
                    placeholder='Enter your answer' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" variant="ghost" size="icon"><IconSend2></IconSend2></Button>
      </form>
    </Form>):(
  <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(startTest)} >
        <Button className="w-full flex items-center justify-between rounded-full bg-secondary my-shadow h-10 px-5" type="submit" size="lg">Abfrage starten</Button>
      </form>
    </Form>)}
  
    </div>
  )
}

    

