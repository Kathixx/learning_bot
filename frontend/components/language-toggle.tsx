'use client';

import {  usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

export function LanguageToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const newLocale = locale === 'de' ? 'en' : 'de';

  const handleToggle = () => {

    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Button variant="ghost" onClick={handleToggle} size={"sm"} color="black">
      {newLocale.toUpperCase()}
    </Button>
  );
}
