import type { Metadata } from "next";
import {  Albert_Sans, Nunito } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "../globals.css";

import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Deepr",
  description: "Deep questions. Smarter learning.",
};


const albertFont = Albert_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-albert"
});

const nunitoFont = Nunito({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito"
});


export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;

}>,
) {

  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }


  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${albertFont.className} ${nunitoFont.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
