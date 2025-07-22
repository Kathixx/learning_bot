import { EnvVarWarning } from "@/components/env-var-warning"
import { AuthButton } from "@/components/auth-button"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageToggle } from "@/components/language-toggle"
import { hasEnvVars } from "@/lib/utils"
import { ModusSelector } from "@/components/modus-selector"
import Image from 'next/image'
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";




export async function Nav() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <nav className="w-full h-16 flex px-4 justify-between items-center gap-20 border-b border-b-secondary my-shadow  ">
      <Link href="/"><Image src="/logo.png" width={200} height={50} alt="Learnboost small Logo"></Image></Link>
      <ModusSelector/>   
      <div className="flex justify-end gap-3 w-[200px]">
        <div className="flex flex-row">
          <LanguageToggle/>
          <ThemeSwitcher />
        </div>
        <AuthButton />       
      </div>
    </nav>
  ):(
    <nav className="w-full h-16 flex px-4 justify-between items-center gap-20 border-b border-b-secondary my-shadow  ">
      <Link href="/"><Image src="/logo.png" width={200} height={50} alt="Learnboost small Logo"></Image></Link>
      <div className="flex justify-end gap-3 w-[200px]">
        <div className="flex flex-row">
          <LanguageToggle/>
          <ThemeSwitcher />
        </div>
        {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}        
      </div>
    </nav>
  )

}
