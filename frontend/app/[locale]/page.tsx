import {Footer} from "@/components/footer"
import {Nav} from "@/components/nav"
import {useTranslations} from 'next-intl';

export default function Home() {

  const t = useTranslations('Home');


  return (
    <main className="h-screen flex flex-col items-center">
        <Nav/>
        <div className="flex-1 flex flex-col gap-20 max-w-5xl p-5">
          <div className="w-full h-full flex flex-1 flex-col pt-[20%] items-center ">
            <p className="text-xl mb-3" >{t('greeting')}</p>
            <h1 className="text-4xl text-center">{t('greeting-msg')} </h1>
          </div>
        </div>
        <Footer/>
    </main>
  );
}
