
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTranslations as useDynamicTranslations } from "@/hooks/useTranslations";
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { legalPagesService, LegalPage } from "@/lib/legalPages";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import ANSWER24LOGO from "@/public/Answer24Logo.png";
import { Link } from "@/i18n/navigation";

const Footer = () => {
  const t = useTranslations("common");
  const { t: dynamicT } = useDynamicTranslations();
  const locale = useLocale();
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);

  useEffect(() => {
    loadLegalPages();
  }, [locale]);

  const loadLegalPages = async () => {
    try {
      const pages = await legalPagesService.getAllPages(locale);
      setLegalPages(pages.filter(page => page.is_active));
    } catch (error) {
      console.error('Error loading legal pages for footer:', error);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <Image 
                src={ANSWER24LOGO} 
                alt="Answer24 Logo" 
                width={180} 
                height={60}
                className="h-auto w-auto"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              {dynamicT('footer.tagline', 'Your trusted partner for innovative solutions and exceptional service.')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-lg">
              {dynamicT('footer.quick_links', 'Quick Links')}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  {dynamicT('footer.about', 'About Us')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  {dynamicT('footer.services', 'Services')}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  {dynamicT('footer.pricing', 'Pricing')}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  {dynamicT('footer.faq', 'FAQ')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                  {t('footer_contact') || 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-lg">
              {dynamicT('footer.legal', 'Legal')}
            </h3>
            <ul className="space-y-3">
              {legalPages.length > 0 ? (
                legalPages.map((page) => (
                  <li key={page.id}>
                    <Link 
                      href={`/legal/${page.slug}`} 
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      {page.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-400 text-sm">
                  {dynamicT('footer.no_pages', 'No legal pages available')}
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-6 text-lg">
              {dynamicT('footer.contact', 'Contact Us')}
            </h3>
            <address className="not-italic space-y-3">
              <p className="text-gray-600 text-sm">
                {dynamicT('footer.address', '123 Business Street')}<br />
                {dynamicT('footer.city', 'Amsterdam, 1011 AB')}<br />
                {dynamicT('footer.country', 'Netherlands')}
              </p>
              <p className="text-gray-600 text-sm">
                <a href="mailto:info@answer24.com" className="hover:text-blue-600 transition-colors">
                  info@answer24.com
                </a>
              </p>
              <p className="text-gray-600 text-sm">
                <a href="tel:+31123456789" className="hover:text-blue-600 transition-colors">
                  +31 123 456 789
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright and Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Answer24. {dynamicT('footer.all_rights', 'All rights reserved.')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              {dynamicT('footer.privacy', 'Privacy Policy')}
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              {dynamicT('footer.terms', 'Terms of Service')}
            </Link>
            <Link href="/cookies" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
              {dynamicT('footer.cookies', 'Cookie Policy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
