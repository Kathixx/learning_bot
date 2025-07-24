'use client'
import {TestChatContainer} from "@/components/test-chat-container"
import {TestInputContainer} from "@/components/test-input-container"
import { useState, createContext, useContext, useEffect} from 'react'
import { MessageType } from "@/types/message"
import responses from "@/data/random_chatbot_responses.json"
import { v4 as uuidv4 } from 'uuid';

type TestContextType = {
  messages: MessageType[]
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>
  fileName: string
  setFileName: React.Dispatch<React.SetStateAction<string>>
  addMessage : (newMessage: MessageType) => void
  returnJsonMsg: (
    msgType:
      | 'waiting_message'
      | 'thinking_response'
      | 'ready_message'
      | 'welcome_message'
      | 'call_to_action'
      | 'call_to_new_action',
    sender?: 'user' | 'bot'
  ) => MessageType;
};


const TestContext = createContext <TestContextType|null>(null)
const useTestContext = () => useContext(TestContext)


export default function TestBot() {

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    getWelcomeMessages();
  }, []);

  const delay = (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));

  async function getWelcomeMessages() {
    addMessage(returnJsonMsg('welcome_message'))
    await delay(Math.random() * (1000 - 3000) + 3000)
    addMessage(returnJsonMsg('ready_message'))
  }

  function getRandomNumber(){
    return Math.floor(Math.random() * responses.testAnswers.length)
  }

  const addMessage = (newMessage: MessageType) => {
    setMessages(prev => [...prev, newMessage]);
  };

  function returnJsonMsg (
      msgType: 'waiting_message' | 'thinking_response' | 'ready_message' | 'welcome_message' | 'call_to_action' | 'call_to_new_action',
      sender: 'user' | 'bot' = 'bot'
    ): MessageType{
      const currentId = uuidv4()
      const randomNumber = getRandomNumber()
      let currentMsg = ''
  
      switch (msgType) {
        case 'waiting_message':
          currentMsg = responses.testAnswers[randomNumber].waiting_message
          break;
        case 'thinking_response':
          currentMsg = responses.testAnswers[randomNumber].thinking_response;
          break;
        case 'ready_message':
          currentMsg = responses.testAnswers[randomNumber].ready_message;
          break;
        case 'welcome_message':
          currentMsg = responses.testAnswers[randomNumber].welcome_message;
          break;
        case 'call_to_action':
          currentMsg = responses.testAnswers[randomNumber].call_to_action;
          break;
        case 'call_to_new_action':
          currentMsg = responses.testAnswers[randomNumber].call_to_new_action;
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
    <TestContext.Provider value = {{messages, setMessages, fileName, setFileName, addMessage, returnJsonMsg}}>
      <div className="w-full h-screen grid grid-cols-2">
        <div>
          <TestInputContainer></TestInputContainer>
        </div>
        <div className="w-full justify-center items-center h-screen ">      
          <TestChatContainer></TestChatContainer>
        </div>
      </div>
    </TestContext.Provider>
  );
}

export {useTestContext}