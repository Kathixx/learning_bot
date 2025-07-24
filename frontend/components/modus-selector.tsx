"use client";

import * as React from "react";
import { useRouter } from "@/i18n/navigation"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {useTranslations} from 'next-intl';


export function ModusSelector() {

  const [value, setValue] = React.useState("");
  const router = useRouter();
  const t = useTranslations('ModusSelector');

  
  return (
    <div className="flex gap-2">
      <ToggleGroup 
        type="single"
        className="w-[400px]"
        value={value}
			  onValueChange={(value) => {
				if (value == 'learning') router.push("/protected/learning");
        if (value == 'testing') router.push("/protected/testing");
        // if (value == 'cards') router.push("/protected/cards");
        setValue(value);
        }}
		  >
        <ToggleGroupItem value="learning" className="font-extrabold">{t('learning')}</ToggleGroupItem>
        <ToggleGroupItem value="testing" className="font-extrabold">{t('testing')}</ToggleGroupItem>
        {/* <ToggleGroupItem value="summary" className="font-extrabold">{t('summary')}</ToggleGroupItem>
        <ToggleGroupItem value="cards" className="font-extrabold">{t('cards')}</ToggleGroupItem> */}
      </ToggleGroup>
    </div>
  );
  
}
