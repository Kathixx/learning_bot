import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';

type QA = {
  Question: string;
  Answer: string;
};

type Props = {
  currentQA: QA;
  setQA: React.Dispatch<React.SetStateAction<QA>>;
};

export function TestInputSettings({setQA, currentQA}: Props){
    const ctx = useTestContext();
    if (!ctx) throw new Error("Must be used inside <MessageProvider>");
    const { addMessage, returnJsonMsg, fileName } = ctx;

    const t = useTranslations('TestBot');
    
    
    const form = useForm({
        defaultValues: {
            message: "",
        },
    });


    function startTest() {
        console.log("I will send this: ", fileName)
        addMessage(returnJsonMsg('waiting_message'))        
        const url = "http://localhost:5002/getQuestion";
        // Fetch request to the Flask backend
        fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({filename: fileName})
        })
          .then((response) => response.json())
          .then((response) => {
            const responseId = uuidv4()
            addMessage({id:responseId, text: response.Question, sender:"bot"})
            setQA({
              ...currentQA,
              Question: response.Question
            })
            addMessage(returnJsonMsg('call_to_action'))
          })
    }

    return(
        <div className= "grid grid-cols-3 p-4 mb-4 bg-background rounded-lg ">
            <div>
                <h1 className = "font-extrabold pb-2">{t('type')}</h1>
                <RadioGroup defaultValue="option-two">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">{t('fact')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">{t('deep')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">{t('general')}</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <h1 className = "font-extrabold pb-2">{t('level')}</h1>
                <RadioGroup defaultValue="beginner">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">{t('beginner')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">{t('advanced')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert" id="expert" />
                        <Label htmlFor="expert">{t('expert')}</Label>
                    </div>
                </RadioGroup>
            </div>
            <Form {...form}>
                <form 
                    className="flex items-end"
                    onSubmit={form.handleSubmit(startTest)} >
                    <Button className="w-full flex items-center rounded-full bg-secondary  dark:hover:bg-primary font-extrabold text-center text-light hover:text-primary  px-5" type="submit" size="lg">{t('generate-btn')}</Button>
                </form>
            </Form>
            
        </div>
    )
}