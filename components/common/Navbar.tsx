"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  ArrowRight,
  Globe,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ANSWER24LOGO from "@/public/answerLogobgRemover-removebg-preview.png";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitchDropdownOpen, setIsSwitchDropdownOpen] = useState(false);
  const t = useTranslations("Navigation");
  const currentPath = usePathname();
  const router = useRouter();

  // Determine if we're on frontend or dashboard
  const isDashboardView =
    currentPath.includes("/dashboard") ||
    currentPath.includes("/admin") ||
    currentPath.includes("/account");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSwitchDropdownOpen(false);
  };

  const navItems = [
    { name: t("blog"), href: "/blog" },
    { name: t("faq"), href: "/faq" },
    { name: t("webshop"), href: "/webshop" },
    { name: t("pricing"), href: "/pricing" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all bg-white/95 duration-300 ${
        isScrolled
          ? " backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-fit mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <Image
              src={ANSWER24LOGO}
              alt="Answer24 Logo"
              width={200}
              height={200}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -2 }}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
              >
                <Link href={item.href}>{item.name}</Link>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full" />
              </motion.div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4 pl-5">
            {/* Location Switch Dropdown */}
            <div className="relative">
              <DropdownMenu
                open={isSwitchDropdownOpen}
                onOpenChange={setIsSwitchDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-gray-50 border-gray-200 hover:bg-gray-100"
                  >
                    {isDashboardView ? (
                      <>
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4" />
                        <span>Frontend</span>
                      </>
                    )}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/")}
                    className={cn(
                      "cursor-pointer flex items-center space-x-2",
                      !isDashboardView && "bg-blue-50 text-blue-600"
                    )}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Frontend</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleNavigation("/dashboard")}
                    className={cn(
                      "cursor-pointer flex items-center space-x-2",
                      isDashboardView && "bg-blue-50 text-blue-600"
                    )}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <LanguageSwitcher />
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-blue-600"
              >
                {t("signIn")}
              </Button>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white !p-6 rounded-full flex items-center">
                  {t("startFreeTrial")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-6 py-4 space-y-4">
              {/* Mobile Location Switch */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => handleNavigation("/")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all",
                    !isDashboardView
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span>Frontend</span>
                </button>
                <button
                  onClick={() => handleNavigation("/dashboard")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all",
                    isDashboardView
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  )}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("signIn")}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("startFreeTrial")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
