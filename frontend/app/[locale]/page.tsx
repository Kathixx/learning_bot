import {Footer} from "@/components/footer"
import {Nav} from "@/components/nav"
import {useTranslations} from 'next-intl';
import Image from 'next/image'
import Header from '@/public/header.jpg'
import { Button } from "@/components/ui/button"



export default function Home() {

  const t = useTranslations('Home');


  return (
    <main className="h-screen flex flex-col items-center">
        <Nav/>
        <div className="w-full flex-1 flex flex-col pb-[20px] overflow-hidden px-4 gap-4 pt-4 ">
          <div className="w-full h-1/3 bg-background rounded-lg overflow-hidden">
            <Image src={Header} alt="Learnboost small Logo"></Image>
          </div>
          <div className="w-full flex-1 grid grid-cols-3 gap-4 ">
            <div className="col-span-2 bg-background rounded-lg p-8 h-full">
              <p className="mb-1 text-primary font-extrabold" >{t('greeting')}</p>
              <h1 className="text-3xl font-extrabold mb-3">{t('greeting-msg')} </h1>
              <p>Evidenzbasiertes Lernen, insbesondere durch Testen, gilt als eine der wirksamsten Methoden für nachhaltigen Lernerfolg. Beim sogenannten „Retrieval Practice“ wird Wissen aktiv abgerufen, was das Langzeitgedächtnis deutlich stärker stärkt als reines Wiederholen. Gleichzeitig hilft Testen dabei, Wissenslücken sichtbar zu machen, die eigene Lernleistung realistisch einzuschätzen und gezielt nachzusteuern. Durch Feedback können Fehler korrigiert und Missverständnisse frühzeitig erkannt werden. Testbasiertes Lernen fördert zudem die aktive Auseinandersetzung mit Inhalten, steigert die Motivation und verbessert die Anwendung des Gelernten in neuen Kontexten – wissenschaftlich belegt und praxisnah wirksam.</p>
            </div>
            <div className="h-full">
              <div className="bg-background flex-1 rounded-lg p-4 pl-8 pt-8 mb-2">
                <h1 className="text-xl font-extrabold mb-3">Lernen leicht gemacht! </h1>
                <p>Mit deinem Skript chatten? Das geht mit unserem Lernbot. Lass dir alle Fragen beantworten!</p>
                <Button className=" flex items-center justify-self-end rounded-full" type="submit" size="lg">Zum Lernbot</Button>
              </div>
              <div className="bg-background flex-1 rounded-lg p-4 pl-8 pt-8 mt-2">
                <h1 className="text-xl font-extrabold mb-3">Teste dein Wissen </h1>
                <p>Lernkarten schreiben war gestern! Unser Testbot fragt dich ab und korrigiert deine Antworten. </p>
                <Button className="flex items-center justify-self-end px-5" type="submit" size="lg">Zum Testbot</Button>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
    </main>
  );
}
