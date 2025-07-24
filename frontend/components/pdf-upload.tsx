import { useState } from 'react'
import { useTestContext } from "@/app/[locale]/protected/testing/page"


export function PDFUpload() {

    const ctx = useTestContext();
    if (!ctx) throw new Error("Must be used inside <MessageProvider>");
    const { setFileName } = ctx;

    const [status, setStatus] = useState("nothing selected")

  const [file, setFile] = useState<File | null>(null);

  const uploadPDF = async () => {
            
    const formData = new FormData();
    setStatus("processing...")
    if(file){
        formData.append('pdf', file);
    }
    else{
        console.error("No file selected.")
    }
   

    const url = 'http://localhost:5002/upload'
    fetch (url, {
        method: "POST",
        body: formData
    })
    .then((response) => response.json())
    .then((response) => {
        console.log("i will set this:", response.Filepath)
        setFileName (response.Filepath)
        setStatus("done")
        console.log("filename set.")
    })
    .catch((err) => {
        console.log('Error: ', err)
    })
    
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setStatus('pdf selected')
  };


  return (
    <div className= "p-4 m-4 my-shadow rounded-[20px]" >
      <input type="file" accept="application/pdf" onChange={handleChange} />
      {file && <p>Selected: {file.name}</p>}
      <p>Status: {status}</p>
      <button onClick={uploadPDF}>btn Upload PDF</button>
    </div>
  );
}
