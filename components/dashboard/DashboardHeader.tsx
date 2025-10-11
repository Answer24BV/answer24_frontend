"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Bell,
  User as UserIcon,
  LogOut,
  MessageCircle,
  Wallet,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Users as UsersIcon,
  UserCog,
  Newspaper,
  Languages,
  FileText,
  MessageSquare,
  ChevronDown,
  CreditCard,
  Mail,
  Globe,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import ANSWER24LOGO from "@/public/Answer24Logo.png";
import Image from "next/image";
import { tokenUtils } from "@/utils/auth";
import { User } from "@/types/user";
import { NavItem } from "@/types/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/common/NotificationBell";

export function DashboardHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSwitchDropdownOpen, setIsSwitchDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const t = useTranslations("Navigation");
  const currentPath = usePathname();
  const router = useRouter();

  // Determine if we're on frontend or dashboard
  const isDashboardView =
    currentPath.includes("/dashboard") ||
    currentPath.includes("/admin") ||
    currentPath.includes("/account");

  const handleLogout = () => {
    tokenUtils.logout();
    setUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleUserDataUpdate = (event: CustomEvent) => {
      const userData = event.detail;
      if (userData && userData.email && userData.email !== "user@example.com") {
        setUser(userData);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("userDataUpdated", handleUserDataUpdate as EventListener);

    // Initialize user data with retry mechanism
    const loadUserData = () => {
      const userData = tokenUtils.getUser();
      if (userData && userData.email && userData.email !== "user@example.com") {
        setUser(userData);
        return true;
      }
      return false;
    };

    // Try to load user data immediately
    if (!loadUserData()) {
      // If no user data found, retry with exponential backoff
      let retryCount = 0;
      const maxRetries = 10;
      
      const retryInterval = setInterval(() => {
        retryCount++;
        if (loadUserData() || retryCount >= maxRetries) {
          clearInterval(retryInterval);
        }
      }, 200 * retryCount); // Exponential backoff: 200ms, 400ms, 600ms, etc.

      return () => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("userDataUpdated", handleUserDataUpdate as EventListener);
        clearInterval(retryInterval);
      };
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("userDataUpdated", handleUserDataUpdate as EventListener);
    };
  }, []);

  // Create navItems dynamically based on current user state
  const getNavItems = (): NavItem[] => [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["client", "partner", "admin"],
    },
    {
      title: "Messages",
      href: "/dashboard/chat",
      icon: MessageSquare,
      roles: ["client", "partner", "admin"],
      badge: 3,
    },
    {
      title: "Webshop",
      href: "/webshop",
      icon: ShoppingBag,
      roles: ["client", "partner", "admin"],
      badge: 3,
    },
    {
      title: "Email",
      href: "/dashboard/email",
      icon: Mail,
      roles: ["client", "partner", "admin"],
    },
    {
      title: "Admin",
      icon: UserCog,
      href: "#",
      roles: ["admin"],
      subItems: [
        {
          title: t("admin.planManagement"),
          href: "/dashboard/admin/plans",
          icon: CreditCard,
        },
        {
          title: t("admin.userManagement"),
          href: "/dashboard/admin/users",
          icon: UsersIcon,
        },
        {
          title: "Avatar management",
          href: "/dashboard/admin/avatar",
          icon: UsersIcon,
        },
        {
          title: "Blog Management",
          href: "/dashboard/admin/blog",
          icon: Newspaper,
        },
        {
          title: "FAQ Management",
          href: "/dashboard/admin/faq",
          icon: HelpCircle,
        },
        {
          title: "Settings",
          href: "/dashboard/account",
          icon: Settings,
        },
        {
          title: "Translation Management",
          href: "/dashboard/admin/translations",
          icon: Languages,
        },
        {
          title: "Legal Page Management",
          href: "/dashboard/admin/legal-pages",
          icon: FileText,
        },
        {
          title: "About Page",
          href: "/dashboard/admin/about-page",
          icon: FileText,
        },
      ],
    },
  ];

  const navItems = getNavItems();
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role?.name || "admin")
  );

  const isNavItemActive = (item: NavItem) => {
    if (currentPath === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((subItem) => currentPath === subItem.href);
    }
    return false;
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsSwitchDropdownOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-25 transition-all duration-300 border-b border-gray-100/10",
        isScrolled
          ? "bg-background/90 backdrop-blur-lg shadow-lg"
          : "bg-background/80 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2 group">
            <Image
              src={ANSWER24LOGO}
              alt="Answer24 Logo"
              width={150}
              height={150}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-all duration-200 flex items-center group-hover:scale-105",
                          isNavItemActive(item) && "text-blue-600 bg-blue-50"
                        )}
                      >
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="mt-2 p-2 rounded-xl shadow-xl border border-gray-100 min-w-[200px]"
                      sideOffset={10}
                    >
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem
                          key={subItem.title}
                          className="px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors"
                          asChild
                        >
                          <Link href={subItem.href || "#"} className="w-full">
                            {subItem.icon && (
                              <subItem.icon className="mr-2 h-4 w-4" />
                            )}
                            {subItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="overflow-hidden rounded-full"
                  >
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "block px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-all duration-200",
                        isNavItemActive(item) && "text-blue-600 bg-blue-50"
                      )}
                    >
                      {item.title}
                    </Link>
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full",
                        isNavItemActive(item) && "w-full"
                      )}
                    />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
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
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={
                        user?.profile_picture || "https://github.com/shadcn.png"
                      }
                      alt="@shadcn"
                    />
                    <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="w-full cursor-pointer">
                  <Link
                    href="/dashboard/account"
                    className="flex items-center w-full"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.profile")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="w-full cursor-pointer">
                  <Link
                    href="/dashboard/chat"
                    className="flex items-center w-full"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>{t("chat")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem className="w-full cursor-pointer">
                  <Link
                    href="/dashboard/wallet"
                    className="flex items-center w-full"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>{t("wallet")}</span>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="w-full cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("userMenu.logOut")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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

              {filteredNavItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href || "#"}
                  className="cursor-pointer block text-gray-700 hover:text-blue-600 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">
                    Notifications
                  </span>
                  <NotificationBell />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
