"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const NotificationBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  
  // Temporary: Force show for testing (remove this later)
  const FORCE_SHOW_FOR_TESTING = true;

  useEffect(() => {
    const shouldShow = () => {
      console.log('NotificationBanner Debug:');
      console.log('- Notification support:', 'Notification' in window);
      console.log('- Current permission:', Notification.permission);
      console.log('- Previously dismissed:', localStorage.getItem('notification-banner-dismissed'));
      
      if (!('Notification' in window)) {
        console.log('❌ Browser does not support notifications');
        return false;
      }
      if (Notification.permission !== 'default') {
        console.log('❌ Permission already granted/denied:', Notification.permission);
        return false;
      }
      if (localStorage.getItem('notification-banner-dismissed') === 'true') {
        console.log('❌ Banner was previously dismissed');
        return false;
      }
      console.log('✅ Should show banner');
      return true;
    };

    if (shouldShow() || FORCE_SHOW_FOR_TESTING) {
      console.log('⏰ Setting timer to show banner in 2 seconds');
      const timer = setTimeout(() => {
        console.log('🔔 Showing notification banner');
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
        setTimeout(() => {
          new Notification('Answer24', {
            body: 'You\'ll now receive important updates!',
            icon: '/answerLogobgRemover-removebg-preview.png',
          });
        }, 1000);
      } else {
        toast.error('Notifications disabled');
      }
      setShowBanner(false);
    } catch (error) {
      toast.error('Failed to request notification permission');
    } finally {
      setIsRequesting(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('notification-banner-dismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed max-w-fit top-5 rounded-md  right-5 z-400 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
        >
          <div className="md:max-w-7xl max-w-fit mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Stay updated with Answer24 notifications
                  </p>
                  <p className="text-xs text-blue-100">
                    Get instant alerts for important updates and messages
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={requestPermission}
                  disabled={isRequesting}
                  className="text-white cursor-pointer hover:bg-white/20 text-sm px-4 py-1.5 h-auto"
                >
                  {isRequesting ? 'Requesting...' : 'Enable'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissBanner}
                  className="text-white cursor-pointer hover:bg-white/20 p-1.5 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};