// hooks/usePushNotifications.ts
'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

// Mock push notifications interface for now
interface MockPushClient {
  start: () => Promise<void>;
  addDeviceInterest: (interest: string) => Promise<void>;
  removeDeviceInterest: (interest: string) => Promise<void>;
}

class MockPushNotifications {
  static Client = class {
    constructor(config: { instanceId: string }) {
      console.log('Mock Push Notifications initialized with:', config);
    }

    async start(): Promise<void> {
      console.log('Mock push notifications started');
      return Promise.resolve();
    }

    async addDeviceInterest(interest: string): Promise<void> {
      console.log('Added device interest:', interest);
      return Promise.resolve();
    }

    async removeDeviceInterest(interest: string): Promise<void> {
      console.log('Removed device interest:', interest);
      return Promise.resolve();
    }
  };
}

export function usePushNotifications(userId?: string) {
  const beamsClient = useRef<MockPushClient | null>(null);

  useEffect(() => {
    if (!userId) return;

    // Only run in browser
    if (typeof window === 'undefined') return;

    try {
      // Initialize Mock Beams (replace with real implementation when @pusher/push-notifications-web is installed)
      beamsClient.current = new MockPushNotifications.Client({
        instanceId: "1f5da00c-61ac-4bef-8067-08f5ca994e0c",
      });

      // Start registration
      const client = beamsClient.current;
      if (client) {
        client
          .start()
          .then(() => {
            beamsClient.current?.addDeviceInterest('hello');
            console.log('Successfully registered and subscribed!');
            return client.addDeviceInterest(String(userId));
          })
          .then(() => {
            toast.success('Push notifications enabled');
          })
          .catch((error) => {
            console.error('Push notification error:', error);
            toast.error('Failed to enable push notifications');
          });
      }

      // Request browser notification permission
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted');
          }
        });
      }
    } catch (error) {
      console.error('Push notifications initialization error:', error);
    }

    return () => {
      // Optionally, remove interest on unmount
      if (beamsClient.current) {
        beamsClient.current.removeDeviceInterest(String(userId));
      }
    };
  }, [userId]);

  // Function to send a test notification
  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Answer24 Notification', {
        body: 'This is a test notification from Answer24',
        icon: '/favicon.ico',
      });
    }
  };

  return { sendTestNotification };
}
