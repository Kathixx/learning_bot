'use client'
import { PDFViewer } from "@/components/pdf-viewer"
import { LearnPDFUpload } from "@/components/learn-pdf-upload"
import { LearnChatContainer } from "@/components/learn-chat-container"
import { useState, createContext, useContext, useEffect, useRef } from 'react'
import { MessageType } from "@/types/message"
import responses from "@/data/random_chatbot_responses.json"
import { v4 as uuidv4 } from 'uuid';

type LearnContextType = {
  messages: MessageType[]
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
  filename: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  addMessage : (newMessage: MessageType) => void
  returnJsonMsg: (
    msgType:
      | 'thinking_response'
      | 'welcome_message'
      | 'call_to_new_action',
    sender?: 'user' | 'bot'
  ) => MessageType;
}

const LearnContext = createContext <LearnContextType|null>(null)
const useLearnContext = () => useContext(LearnContext)

export default function LearnBot() {

  const welcomeSet = useRef(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [filename, setFileName] = useState("");

  useEffect(() => {
    if(!welcomeSet.current){
      getWelcomeMessages();
      welcomeSet.current = true
    }
    }, []);

  async function getWelcomeMessages() {
    addMessage(returnJsonMsg('welcome_message'))
  }

  function getRandomNumber(){
      return Math.floor(Math.random() * responses.learnAnswers.length)
    }
  
    const addMessage = (newMessage: MessageType) => {
      setMessages(prev => [...prev, newMessage]);
    };
  
    function returnJsonMsg (
        msgType: 'thinking_response' | 'welcome_message' | 'call_to_new_action',
        sender: 'user' | 'bot' = 'bot'
      ): MessageType{
        const currentId = uuidv4()
        const randomNumber = getRandomNumber()
        let currentMsg = ''
    
        switch (msgType) {
          case 'thinking_response':
            currentMsg = responses.learnAnswers[randomNumber].thinking_response;
            break;
          case 'welcome_message':
            currentMsg = responses.learnAnswers[randomNumber].welcome_message;
            break;
          case 'call_to_new_action':
            currentMsg = responses.learnAnswers[randomNumber].call_to_new_action;
            break;
          default:
            currentMsg = 'Unknown message type';
        }
        return {
          id: currentId,
          text: currentMsg,
          sender: sender,
        }
      }

  return (
    <LearnContext.Provider value = {{messages, setMessages, filename, setFileName, addMessage, returnJsonMsg}}>
      <div className="w-full h-screen ">
        {filename === "" ? 
          (<div className="w-full h-screen flex items-center justify-center">
            <LearnPDFUpload></LearnPDFUpload>
            </div>):
          ( <div className="w-full h-screen grid grid-cols-2">
        <div className="w-full h-full flex flex-col pt-[100px] pb-[20px] pr-2 pl-4 overflow-hidden">      
          <PDFViewer></PDFViewer>
        </div>
        <LearnChatContainer></LearnChatContainer>
      </div>)
          }
      </div>
    </LearnContext.Provider>
  );
}

export {useLearnContext}
