import { useTestContext } from "@/app/[locale]/protected/testing/page"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { v4 as uuidv4 } from 'uuid';

type QA = {
  Question: string;
  Answer: string;
};

type Props = {
  currentQA: QA;
  setQA: React.Dispatch<React.SetStateAction<QA>>;
};

export function InputSettings({setQA, currentQA}: Props){
    const ctx = useTestContext();
    if (!ctx) throw new Error("Must be used inside <MessageProvider>");
    const { addMessage, returnJsonMsg, fileName } = ctx;

    
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
        <div className= "grid grid-cols-3 p-4 m-4 my-shadow rounded-[20px] ">
            <div>
                <h1 className = "font-extrabold pb-2">Type of question</h1>
                <RadioGroup defaultValue="option-two">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Faktenwissen</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Tiefergehende Frage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-three" id="option-three" />
                        <Label htmlFor="option-three">Detailfrage</Label>
                    </div>
                </RadioGroup>
            </div>
            <div>
                <h1 className = "font-extrabold pb-2">Level</h1>
                <RadioGroup defaultValue="beginner">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beginner" id="beginner" />
                        <Label htmlFor="beginner">Einfach</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="advanced" id="advanced" />
                        <Label htmlFor="advanced">Mittel</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="expert" id="expert" />
                        <Label htmlFor="expert">Schwer</Label>
                    </div>
                </RadioGroup>
            </div>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(startTest)} >
                    <Button className="w-full h-full flex items-center rounded-[10px] bg-third font-extrabold text-center text-background  px-5" type="submit" size="lg">Neue Frage generieren</Button>
                </form>
            </Form>
            
        </div>
    )
}