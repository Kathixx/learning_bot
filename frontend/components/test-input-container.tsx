"use client"
import { TestInput } from "@/components/test-input"
import { TestPDFUpload } from "@/components/test-pdf-upload";
import { InputSettings } from "@/components/input-settings";
import { useState } from 'react'



export function TestInputContainer() {

  const [currentQA, setQA] = useState({
    Question: "",
    Answer: ""
  })

  return (
    <div className="w-full h-full overflow-hidden pt-[100px] pb-[40px] pr-4 pl-4 flex flex-col">
      <div>
        <TestPDFUpload></TestPDFUpload>
      </div>
      <div> 
        <InputSettings currentQA={currentQA} setQA={setQA}></InputSettings>
      </div>
      <div className="flex-1">
        <TestInput currentQA={currentQA} setQA={setQA}></TestInput>
      </div>
    </div>
  )
}

    

