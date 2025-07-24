"use client"
import { TestInput } from "@/components/test-input"
import { TestPDFUpload } from "@/components/test-pdf-upload";
import { TestInputSettings } from "@/components/test-input-settings";
import { useState } from 'react'



export function TestInputContainer() {

  const [currentQA, setQA] = useState({
    Question: "",
    Answer: ""
  })

  return (
    <div className="w-full h-full overflow-hidden pt-[100px] pb-[20px] pr-2 pl-4 flex flex-col">
      <div>
        <TestPDFUpload></TestPDFUpload>
      </div>
      <div> 
        <TestInputSettings currentQA={currentQA} setQA={setQA}></TestInputSettings>
      </div>
      <div className="flex-1">
        <TestInput currentQA={currentQA} setQA={setQA}></TestInput>
      </div>
    </div>
  )
}

    

