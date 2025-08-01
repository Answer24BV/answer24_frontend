"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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
  User,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users as UsersIcon,
  UserCog,
  Newspaper,
  MessageSquare,
  Wallet,
  Plus,
  Bell,
} from 'lucide-react';

import ANSWER24LOGO from "@/public/answerLogobgRemover-removebg-preview.png";
import Image from "next/image";

interface BaseNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  badge?: string | number;
}

interface NavItem extends BaseNavItem {
  roles?: string[];
  subItems?: BaseNavItem[];
};

interface SidebarProps {
  className?: string;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

interface NavItemProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  item,
  isActive,
  isCollapsed,
  onClick
}) => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const Icon = item.icon;
  
  const router = useRouter();
  
  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems) {
      e.preventDefault();
      setIsOpen(!isOpen);
      // Don't close the menu when toggling submenus
      return;
    }
    // Close mobile menu when a direct link is clicked
    if (onClick) {
      e.preventDefault();
      onClick();
      // Small delay to allow the menu to close before navigation
      setTimeout(() => {
        router.push(item.href);
      }, 100);
    }
  };
  
  return (
    <div className="relative">
      <Link
        href={hasSubItems ? '#' : item.href}
        onClick={handleClick}
        className={cn(
          'relative flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-50',
          isCollapsed ? 'justify-center' : 'justify-start',
          item.className
        )}
      >
        <div className="flex items-center">
          <Icon
            className={cn(
              'flex-shrink-0',
              isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700',
              isCollapsed ? 'h-5 w-5' : 'h-5 w-5 mr-3'
            )}
            aria-hidden="true"
          />
          {!isCollapsed && (
            <span className="truncate">
              {item.title}
              {item.badge && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </span>
          )}
        </div>
        {!isCollapsed && hasSubItems && (
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen ? 'rotate-90' : ''
            )}
          />
        )}
      </Link>

      {!isCollapsed && hasSubItems && item.subItems && (
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pl-4 mt-1 space-y-1 overflow-hidden"
            >
              {item.subItems.map((subItem) => {
                const isSubItemActive = currentPath === subItem.href;
                const SubItemIcon = subItem.icon;
                
                return (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    onClick={(e) => {
                      // Close mobile menu when sub-item is clicked
                      if (onClick) {
                        e.preventDefault();
                        onClick();
                        // Small delay to allow the menu to close before navigation
                        setTimeout(() => {
                          router.push(subItem.href);
                        }, 100);
                      }
                    }}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm rounded-md',
                      'text-gray-700 hover:bg-gray-100',
                      isSubItemActive && 'bg-blue-50 text-blue-600 font-medium',
                      isCollapsed ? 'justify-center' : 'pl-12',
                      subItem.className
                    )}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-3"></span>
                    {subItem.title}
                    {subItem.badge && (
                      <span className="ml-auto bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {subItem.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export function Sidebar({ className, collapsed: propCollapsed, onCollapse }: SidebarProps) {
  const router = useRouter();
  const currentPath = usePathname();
  const [userRole, setUserRole] = useState('client');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(propCollapsed || false);
  
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
    {
      title: 'Services',
      icon: Briefcase,
      href: '#',
      roles: ['client', 'partner', 'admin'],
      subItems: [
        {
          title: 'My Services',
          href: '/dashboard/services',
          icon: Briefcase,
        },
        {
          title: 'New Service',
          href: '/dashboard/services/new',
          icon: Plus,
        },
      ],
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
          href: '/admin/users',
          icon: UsersIcon,
        },
        {
          title: 'Blog',
          href: '/admin/blog',
          icon: Newspaper,
        },
        {
          title: 'Settings',
          href: '/admin/settings',
          icon: Settings,
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
    (item) => !item.roles || item.roles.includes(userRole)
  );
  
  const filteredBottomNavItems = bottomNavItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );
  
  // User initials for avatar
  const userInitials = 'JD'; // Replace with actual user data

  // Handle logout
  const handleLogout = async () => {
    await signOut();
    router.push('/signin');
  };

  // Check if a nav item is active
  const isNavItemActive = (item: NavItem) => {
    if (currentPath === item.href) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => currentPath === subItem.href);
    }
    return false;
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <motion.button
          className={cn(
            'fixed top-4 left-4 z-50 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center',
            'transition-all duration-200 hover:bg-gray-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
            // isMobileOpen ? 'left-64' : 'left-4',
            // !isMobileOpen && 'shadow-md'
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
      {/* <AnimatePresence> */}
        {isMobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            transition={{ duration: 0.2 }}
          />
        )}
      {/* </AnimatePresence> */}

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col',
          'bg-white border-r border-gray-200 shadow-xl',
          'h-screen overflow-hidden',
          className
        )}
        initial={false}
        animate={{
          // width: isCollapsed ? '5rem' : '16rem',
          // x: isMobileOpen ? 0 : ['-100%', '0%'],
          // transition: {
          //   width: { type: 'spring', stiffness: 300, damping: 30 },
          //   x: { type: 'spring', stiffness: 400, damping: 40 },
          // },
        }}
        // style={{
        //   willChange: 'transform, width',
        //   transform: 'translateZ(0)',
        //   WebkitBackfaceVisibility: 'hidden',
        //   WebkitPerspective: '1000',
        //   WebkitTransform: 'translate3d(0,0,0)',
        // }}
      >
        {/* Logo and Collapse Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center flex-1">
            <Link
              href="/dashboard"
              className={cn(
                // 'flex items-center space-x-2 flex-1',
                // isCollapsed ? 'justify-center' : 'justify-start'
              )}
              // onClick={() => setIsMobileOpen(false)}
            >
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src={ANSWER24LOGO}
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* {!isCollapsed && (
                <span className="text-lg font-bold text-gray-800">Answer24</span>
              )} */}
            </Link>

            {/* Collapse Button - Visible when expanded */}
            {/* {!isCollapsed && (
              <button
                onClick={handleCollapse}
                className="ml-auto p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )} */}
          </div>

          {/* Mobile Close Button */}
          {/* <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden ml-2 p-1.5 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button> */}
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
                  <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                  <p className="text-xs text-gray-500 truncate">john@example.com</p>
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
            {filteredNavItems.map((item) => (
              <NavItem
                key={item.href}
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
              <NavItem
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
