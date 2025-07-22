"use client";


import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { IconUser } from "@tabler/icons-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl';


export function ProfilButton() {
  const router = useRouter();
  
  const t = useTranslations('Profil')
   
  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };
  
  const ICON_SIZE = 16;

  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-full bg-secondary hover:bg-secondary" size="icon">
            <IconUser size={ICON_SIZE} color="white"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="my-menu">
          <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>{t('logout')}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

  
  );
}
