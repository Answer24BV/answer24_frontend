"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  Plus,
  MessageSquare,
  ChevronDown,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import LanguageSwitcher from "@/components/common/LanguageSwitcher"
import { Link } from "@/i18n/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from "next-intl"
import ANSWER24LOGO from "@/public/Answer24Logo.png"
import Image from "next/image"
import { tokenUtils } from "@/utils/auth"
import { User } from "@/types/user"
import { NavItem } from "@/types/sidebar"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function DashboardHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const t = useTranslations("Navigation")
  const currentPath = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    const userData = tokenUtils.getUser()
    setUser(userData)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems: NavItem[] = [
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
      title: "Finance",
      href: "/dashboard/wallet",
      icon: Wallet,
      roles: ["client", "partner", "admin"],
    },
    {
      title: "Clients",
      icon: UsersIcon,
      href: "#",
      roles: ["partner", "admin"],
      subItems: [
        {
          title: "All Clients",
          href: "/dashboard/clients",
          icon: UsersIcon,
        },
        {
          title: "Add New",
          href: "/dashboard/clients/new",
          icon: Plus,
        },
      ],
    },
    {
      title: "Admin",
      icon: UserCog,
      href: "#",
      roles: ["admin"],
      subItems: [
        {
          title: "Users",
          href: "/dashboard/admin/users",
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
  ]

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.userType || "admin")
  )

  const isNavItemActive = (item: NavItem) => {
    if (currentPath === item.href) return true
    if (item.subItems) {
      return item.subItems.some((subItem) => currentPath === subItem.href)
    }
    return false
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-sm shadow-md" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/dashboard">
            <Image
              src={ANSWER24LOGO}
              alt="Answer24 Logo"
              width={150}
              height={150}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavItems.map((item) => (
              <div key={item.title} className="relative group">
                {item.subItems ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 flex items-center",
                          isNavItemActive(item) && "text-blue-600"
                        )}
                      >
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {item.subItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.title} asChild>
                          <Link href={subItem.href || "#"}>{subItem.title}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <motion.div whileHover={{ y: -2 }}>
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200",
                        isNavItemActive(item) && "text-blue-600"
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
            <LanguageSwitcher />
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.avatar || "https://github.com/shadcn.png"}
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
                <DropdownMenuItem>
                  <Link href="/dashboard/account" className="flex  items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>{t("userMenu.profile")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/dashboard/chat" className="flex  items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span>{t("chat")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="/dashboard/account/wallet"
                    className="flex  items-center"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    <span>{t("wallet")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
