'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"


export function Tester(){

  const t = useTranslations('Chat')
  
  const form = useForm({
    defaultValues: {
      answer: "",
    },
  });

  const [isLoading, setIsloading] = useState(false);

  const [result, setResult] = useState("");

  function onSubmit(values: { answer: string }) {
    const url = "http://localhost:5002/check";
    setIsloading(true);
    const jsonData = JSON.stringify(values.answer);
    // Fetch request to the Flask backend
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
        setResult(response.Answer);
        console.log('We got you:' + response.Check)
        setIsloading(false);
      });
    form.reset()
  }

    return (
        <div>
        <Form {...form}>
      <h1>TestBot</h1>
       <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="w-full flex items-center justify-between rounded-full bg-background my-shadow h-auto px-5">
            <div className="flex-1">
                <FormField
                control={form.control}
                name="answer"
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
            <Button 
            type="submit"                 
            disabled={isLoading}
            variant="ghost" 
            size="sm">Check Answer</Button>
            </form>
        </Form>
        <span>
            {result && Object.keys(result).length !== 0 ? (
                <p>Your result: {result}</p>
                ) : (
                <p>Please enter your answer and press Enter.</p>
            )}
        </span>
    </div>
    )
}