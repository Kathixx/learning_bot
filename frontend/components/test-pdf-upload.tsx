import { useState } from 'react'
import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from 'next-intl';


export function TestPDFUpload() {

    const t = useTranslations('TestBot');
  
    const ctx = useTestContext();
    if (!ctx) throw new Error("Must be used inside <MessageProvider>");
    const { setFileName } = ctx;

    const [selected, setSelected] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [processed, setProcessed] = useState(false)

  const [file, setFile] = useState<File | null>(null);

  const uploadPDF = async () => {
            
    setUploaded(true)
    const formData = new FormData();
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
        setProcessed(true)
        console.log("filename set.")
    })
    .catch((err) => {
        console.log('Error: ', err)
    })
    
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setSelected(true)
  };


  return (
    <div className= "p-4 mb-4 bg-background h-fit rounded-lg" >
      <h1 className="font-extrabold pb-2">{t('upload')}</h1>
      {!selected ?  (<p> {t('none')}</p>) : (!uploaded && <p> {t('selected')}</p>)}
      {uploaded && !processed && <p> {t('uploaded')}</p>}
      {processed && <p> {t('done')}</p>}
      <div className="flex pt-2">
        <Input className ="rounded-full rounded-r-none border-secondary" type="file" accept="application/pdf" onChange={handleChange} />
        <Button className="items-center rounded-full dark:hover:bg-primary rounded-l-none bg-secondary font-extrabold text-center text-light  px-5" onClick={uploadPDF}>{t('upload-btn')}</Button>
      </div>
    </div>
  );
}
