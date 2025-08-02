"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
// Sign out handler
const signOut = async () => {
  // Handle sign out logic here
  return { error: null };
};
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Search,
  Briefcase,
  Users as UsersIcon,
  UserCog,
  Newspaper,
  MessageSquare,
  Wallet,
  Plus,
  Bell,
  Languages,
  FileText,
} from 'lucide-react';

import ANSWER24LOGO from "@/public/answerLogobgRemover-removebg-preview.png";
import Image from "next/image";
import { NavItem } from '@/types/sidebar';
import { NavItem as NavItemComponent } from './NavItem';
import { tokenUtils } from '@/utils/auth';
import { User } from '@/types/user';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';





interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export function Sidebar({ className, collapsed: propCollapsed, onCollapse }: SidebarProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(propCollapsed || false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

    const { locale } = useParams();
  
    // Generate the href based on the route
    const getHref = (route: string) => {
      return `/${locale}${route}`;
    };
  // Handle click outside to close sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isMobileOpen) {
          setIsMobileOpen(false);
        }
      }
    }

    // Add event listener when mobile menu is open
    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Handle responsive behavior and animations
  useEffect(() => {
    const userData = tokenUtils.getUser();
    setUser(userData);
    const isDesktop = window.innerWidth >= 768; // md breakpoint

    if (isDesktop) {
      // Always show sidebar on desktop
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    } else if (isMobileOpen) {
      // Show sidebar on mobile when isMobileOpen is true
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    } else {
      // Hide sidebar on mobile when isMobileOpen is false
      controls.start({
        x: '-100%',
        opacity: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    }

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // On desktop, ensure sidebar is visible
        controls.start({
          x: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        });
      } else if (!isMobileOpen) {
        // On mobile, hide if not explicitly opened
        controls.start({
          x: '-100%',
          opacity: 0,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen, controls]);

  // Sync with prop changes
  useEffect(() => {
    if (propCollapsed !== undefined) {
      setIsCollapsed(propCollapsed);
    }
  }, [propCollapsed]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle user logout
  const handleUserLogout = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items with simplified structure
  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['client', 'partner', 'admin'],
    },
    {
      title: 'Messages',
      href: '/dashboard/chat',
      icon: MessageSquare,
      roles: ['client', 'partner', 'admin'],
      badge: 3,
    },
    {
      title: 'Finance',
      href: '/dashboard/wallet',
      icon: Wallet,
      roles: ['client', 'partner', 'admin'],
    },
    // {
    //   title: 'Services',
    //   icon: Briefcase,
    //   href: '#',
    //   roles: ['client', 'partner', 'admin'],
    //   subItems: [
    //     {
    //       title: 'My Services',
    //       href: '/dashboard/services',
    //       icon: Briefcase,
    //     },
    //     {
    //       title: 'New Service',
    //       href: '/dashboard/services/new',
    //       icon: Plus,
    //     },
    //   ],
    // },
    {
      title: 'Clients',
      icon: UsersIcon,
      href: '#',
      roles: ['partner', 'admin'],
      subItems: [
        {
          title: 'All Clients',
          href: '/dashboard/clients',
          icon: UsersIcon,
        },
        {
          title: 'Add New',
          href: '/dashboard/clients/new',
          icon: Plus,
        },
      ],
    },
    {
      title: 'Admin',
      icon: UserCog,
      href: '#',
      roles: ['admin'],
      subItems: [
        {
          title: 'Users',
          href: '/dashboard/admin/users',
          icon: UsersIcon,
        },
        {
          title: 'Blog Management',
          href: '/dashboard/admin/blog',
          icon: Newspaper,
        },
        {
          title: 'FAQ Management',
          href: '/dashboard/admin/faq',
          icon: HelpCircle,
        },
        {
          title: 'Settings',
          href: '/dashboard/account',
          icon: Settings,
        },
        {
          title: 'Translation Management',
          href: '/dashboard/admin/translations',
          icon: Languages,
        },
        {
          title: 'Legal Page Management',
          href: '/dashboard/admin/legal',
          icon: FileText,
        },
      ],
    },
  ];

  const bottomNavItems: NavItem[] = [
    {
      title: 'Help & Support',
      href: '/support',
      icon: HelpCircle,
      roles: ['client', 'partner', 'admin'],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      roles: ['client', 'partner', 'admin'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.userType || 'admin')
  );

  const filteredBottomNavItems = bottomNavItems.filter(
    (item) => !item.roles || item.roles.includes(user?.userType || 'admin')
  );

  // User initials for avatar
  const userInitials = user?.name?.[0].toUpperCase() || 'U'; // Replace with actual user data

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    router.push(getHref('/signin'));
  };

  // Check if a nav item is active - handles both with and without locale prefix
  const isNavItemActive = (item: NavItem) => {
    // Check direct match
    if (currentPath === item.href || currentPath === `/${locale}${item.href}`) return true;
    
    // Check if any subitems match
    if (item.subItems) {
      return item.subItems.some(subItem => 
        currentPath === subItem.href || 
        currentPath === `/${locale}${subItem.href}`
      );
    }
    
    return false;
  };

  return (
    <>
      {/* Mobile menu button - Only shown on mobile */}
      <div className="md:hidden">
        <motion.button
          className={cn(
            'fixed top-4 right-4 z-50 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center',
            'transition-all duration-200 hover:bg-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'shadow-md'
          )}
          onClick={() => {
            const isDesktop = window.innerWidth >= 768;
            if (!isDesktop) {
              setIsMobileOpen(!isMobileOpen);
            }
          }}
          aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Mobile overlay with click outside - Only on mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              const isMobile = window.innerWidth < 768;
              if (isMobile) {
                setIsMobileOpen(false);
              }
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          'bg-white border-r border-gray-200',
          'h-screen overflow-hidden',
          'shadow-lg',
          className
        )}
        initial={{ x: '-100%', opacity: 0 }}
        animate={controls}
        style={{
          width: isCollapsed ? '5rem' : '16rem',
          willChange: 'width',
        }}
      >
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center flex-1">
            <Link
              href="/dashboard"
            >
              <div className="relative h-36 w-36 flex-shrink-0">
                <Image
                  src={ANSWER24LOGO}
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <motion.button
              onClick={handleCollapse}
              className={cn(
                'p-2 rounded-full text-gray-500 hover:bg-gray-100',
                'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              data-tooltip-id="sidebar-tooltip"
              data-tooltip-content={isCollapsed ? 'Expand' : 'Collapse'}
            >
              {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </motion.button>
            <Tooltip id="sidebar-tooltip" place="right" />
          </div>
        </div>

        {/* User Profile */}
        <div
          className={cn(
            'px-4 py-3 border-b border-gray-100',
            isCollapsed ? 'px-2' : 'px-4'
          )}
        >
          <div
            className={cn(
              'flex items-center space-x-3',
              isCollapsed ? 'justify-center' : 'justify-between'
            )}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-medium text-blue-600">{userInitials}</span>
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full w-8 h-8"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Search (only visible when expanded) */}
        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2">
          <nav className={cn('space-y-1', isCollapsed ? 'px-2' : 'px-3')}>
            {filteredNavItems.map((item, index) => (
              <NavItemComponent
                key={index}
                item={item}
                isActive={isNavItemActive(item)}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* Bottom Navigation */}
        <div className={cn('border-t border-gray-100', isCollapsed ? 'px-2' : 'px-3')}>
          <nav className="py-2 space-y-1">
            {filteredBottomNavItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                isActive={currentPath === item.href}
                isCollapsed={isCollapsed}
                onClick={() => setIsMobileOpen(false)}
              />
            ))}

            {/* Collapse Button - Only show in collapsed state at bottom */}
            {isCollapsed && (
              <motion.button
                onClick={handleCollapse}
                className={cn(
                  'w-full flex items-center justify-center p-3 text-sm font-medium',
                  'text-gray-600 hover:bg-gray-50 rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                  'mt-2 mb-4 mx-auto'
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                aria-label="Expand sidebar"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            )}
          </nav>
        </div>
      </motion.aside>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsMobileOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}