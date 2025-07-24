'use client'
import {PDFViewer} from "@/components/pdf-viewer"
import {ChatContainer} from "@/components/chat-container"

export default function LearnBot() {

  return (
    <div className="w-full h-screen grid grid-cols-2">
      <div className="w-full justify-center items-center h-screen pt-[100px]">      
        <PDFViewer></PDFViewer>
      </div>
      <ChatContainer></ChatContainer>
    </div>
  );
}
