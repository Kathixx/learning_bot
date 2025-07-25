import { IconMoodSmile, IconRobot } from "@tabler/icons-react"

type MessageItemProps = {
  sender: string
  text: string
};

export function MessageItem({ sender, text }: MessageItemProps) {
  
  const isBot = sender === "bot"

  return(
   <div>
    {isBot && (
      <div className="flex flex-row items-center justify-start gap-2 py-1">
        <div className="bg-primary rounded-full flex items-center justify-center p-3 ">
          <IconRobot color="white" size={18} />
        </div>
        <div className="rounded-[20px] rounded-bl-none bg-light dark:bg-[#2f1131] p-3 mr-[50px]">
          <p className="text-sm">{text}</p>
        </div>
      </div>
    )}
    {!isBot &&(
       <div className="flex flex-row items-center justify-end gap-2 py-1">
        <div className="rounded-[20px] rounded-br-none bg-[#7fbbc650] dark:bg-[#ffffff59] p-3 ml-[50px] ">
          <p className="text-sm">{text}</p>
        </div>
        <div className="rounded-full bg-third flex items-center justify-center p-3">
          <IconMoodSmile color="white" size={18} />
        </div>
      </div>
    )}
    </div>
  )
   
}
