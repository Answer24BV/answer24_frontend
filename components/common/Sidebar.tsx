"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

// Import auth utilities at the top

import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
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
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import NotificationBell from './NotificationBell';

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
  const [isHovered, setIsHovered] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();

  const { locale } = useParams();
  
  // Generate the href based on the route
  const getHref = (route: string) => {
    return `/${locale}${route}`;
  };

  // Check if current route is chat
  const isChatRoute = currentPath.includes('/dashboard/chat');

  // Auto-collapse on chat route
  useEffect(() => {
    if (isChatRoute && !isCollapsed) {
      setIsCollapsed(true);
      onCollapse?.(true);
    }
  }, [isChatRoute, isCollapsed, onCollapse]);

  // Handle click outside to close sidebar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        if (isMobileOpen) {
          setIsMobileOpen(false);
        }
      }
    }

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen]);

  // Handle responsive behavior and animations
  useEffect(() => {
    const userData = tokenUtils.getUser();
    setUser(userData);
    const isDesktop = window.innerWidth >= 768;

    if (isDesktop) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    } else if (isMobileOpen) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    } else {
      controls.start({
        x: '-100%',
        opacity: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 }
      });
    }

    const handleResize = () => {
      if (window.innerWidth >= 768) {
        controls.start({
          x: 0,
          opacity: 1,
          transition: { type: 'spring', stiffness: 300, damping: 30 }
        });
      } else if (!isMobileOpen) {
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
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleUserLogout = async () => {
    try {
      tokenUtils.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Navigation items
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
    {
      title: 'Notifications',
      href: '/partner/notifications',
      icon: Bell,
      roles: ['client', 'partner', 'admin'],
    },
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
          href: '/dashboard/admin/legal-pages',
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

  const userInitials = user?.name?.[0].toUpperCase() || 'U';

  const handleLogout = async () => {
    tokenUtils.logout();
  };

  const isNavItemActive = (item: NavItem) => {
    if (currentPath === item.href || currentPath === `/${locale}${item.href}`) return true;
    
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
      {/* Mobile menu button */}
      <div className="md:hidden">
        <motion.button
          className={cn(
            'fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-2',
            'transition-all duration-200 hover:bg-gray-50',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            'border border-gray-200'
          )}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
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

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Desktop Collapse Button - Positioned outside sidebar */}
      <div className="hidden md:block">
        <motion.button
          onClick={handleCollapse}
          className={cn(
            'fixed top-6 z-50 bg-white border border-gray-200 rounded-full p-2 shadow-lg',
            'hover:bg-gray-50 hover:shadow-xl transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isCollapsed ? 'left-20' : 'left-72' // Position based on sidebar state
          )}
          style={{
            transition: 'left 300ms ease-in-out, transform 200ms ease-in-out'
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          data-tooltip-id="collapse-tooltip"
          data-tooltip-content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          data-tooltip-place="right"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </motion.button>
        <Tooltip id="collapse-tooltip" />
      </div>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          'bg-white border-r border-gray-200',
          'h-screen overflow-hidden',
          'shadow-sm transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64',
          className
        )}
        initial={{ x: '-100%', opacity: 0 }}
        animate={controls}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Logo section */}
        <div className={cn(
          'flex items-center h-16 border-b border-gray-100',
          isCollapsed ? 'px-2 justify-center' : 'px-4'
        )}>
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className={`relative ${ !isCollapsed ? "h-38 w-38" : "h-5 w-16"} flex-shrink-0`}>
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

        {/* User Profile */}
        <div className={cn(
          'px-4 py-3 border-b border-gray-100',
          isCollapsed ? 'px-2' : 'px-4'
        )}>
          <div className={cn(
            'flex items-center',
            isCollapsed ? 'justify-center' : 'space-x-3'
          )}>
            <div 
              className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm"
              data-tooltip-id={isCollapsed ? "user-tooltip" : undefined}
              data-tooltip-content={isCollapsed ? user?.name || 'User' : undefined}
              data-tooltip-place="right"
            >
              <span className="text-sm font-semibold text-white">{userInitials}</span>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  className="flex-1 min-w-0"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <NotificationBell />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1.5"
                        onClick={handleLogout}
                        data-tooltip-id="logout-tooltip"
                        data-tooltip-content="Sign out"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                      <Tooltip id="logout-tooltip" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {isCollapsed && <Tooltip id="user-tooltip" />}
          </div>
        </div>

        {/* Search - only visible when expanded */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="px-4 py-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-colors"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          </nav>
        </div>
      </motion.aside>
    </>
  );
}