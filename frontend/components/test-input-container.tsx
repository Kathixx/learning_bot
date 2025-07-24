"use client"
import { TestInput } from "@/components/test-input"
import { PDFUpload } from "@/components/pdf-upload";
import { InputSettings } from "@/components/input-settings";
import { useState } from 'react'



export function TestInputContainer() {

  const [currentQA, setQA] = useState({
    Question: "",
    Answer: ""
  })

  return (
    <div className="w-full h-full overflow-hidden pt-[100px]">
      <div>
        <PDFUpload></PDFUpload>
      </div>
      <div> 
        <InputSettings currentQA={currentQA} setQA={setQA}></InputSettings>
      </div>
      <div>
        <TestInput currentQA={currentQA} setQA={setQA}></TestInput>
      </div>
    </div>
  )
}

    

