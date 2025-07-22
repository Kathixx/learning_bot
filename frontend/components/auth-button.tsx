import { Link } from "@/i18n/navigation";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { ProfilButton } from "./profil-button";
import {getTranslations} from 'next-intl/server'

export async function AuthButton() {
  const supabase = await createClient();
  const t = await getTranslations('EnvVarWarning');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <ProfilButton/>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login"> {t('signin')}</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up"> {t('signup')}</Link>
      </Button>
    </div>
  );
}
