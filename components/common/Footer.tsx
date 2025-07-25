
"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("common");
  return (
    <footer className="bg-secondary text-secondary-foreground py-6">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">{t('footer_copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex space-x-4">
            <Link href="/about" className="text-sm hover:underline">
              {t('footer_about')}
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              {t('footer_contact')}
            </Link>
            <Link href="/privacy-policy" className="text-sm hover:underline">
              {t('footer_privacy_policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
