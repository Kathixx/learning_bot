"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation"


import {
  NavigationMenu,
//   NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils" 
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from "next-intl"; 




export function ModusNav() {

    const t = useTranslations('Nav');
    const pathname = usePathname()
    const router = useRouter();
    const isTestBot = pathname.includes("/protected/testing")
    const isLearnBot = pathname.includes("/protected/learning")

  function navigate(href:string){
    console.log(pathname)
    router.push(href)
  }
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="rounded-full bg-background text-black">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={cn('rounded-full font-extrabold text-black dark:text-white', isLearnBot ? 'bg-primary hover:bg-primary' : 'hover:text-primary dark:hover:text-primary')}>
            <Button variant="destructive" onClick={() =>navigate('/protected/learning')}>{t('learning')}</Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={cn('rounded-full font-extrabold text-black dark:text-white', isTestBot ? 'bg-primary hover:bg-primary' : 'hover:text-primary dark:hover:text-primary')}>
            <Button variant="destructive" onClick={() =>navigate('/protected/testing')}>{t('testing')}</Button>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
  )
}

