
"use client";

import { getNotifications, markAsRead, Notification } from '@/app/actions/notificationActions';
import { getPropertyAlerts, propertyAlertDataRes } from '@/services/propertyalerts.service';
import Avatar from '@/components/common/Avatar';
import { tokenUtils } from '@/utils/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bell, Home, Clock, DollarSign } from 'lucide-react';

const AllNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [propertyAlerts, setPropertyAlerts] = useState<propertyAlertDataRes[]>([]);
    const [activeTab, setActiveTab] = useState('notifications');
    const [notificationsLoader, setNotificationsLoader] = useState(false);
    const [alertsLoader, setAlertsLoader] = useState(false);

    const fetchNotifications = async (page: number) => {
        try {
            setNotificationsLoader(true);
            const data = await getNotifications(page);
            setNotifications(data);
        } catch (error: any) {
            toast.error(error.message || "Error fetching notifications");
        } finally {
            setNotificationsLoader(false);
        }
    };

    const fetchPropertyAlerts = async (page: number) => {
        try {
            const token = tokenUtils.getToken();
            if (!token) throw new Error("Unauthorized");
            setAlertsLoader(true);
            const data = await getPropertyAlerts(token, page);
            setPropertyAlerts(data);
        } catch (error: any) {
            toast.error(error.message || "Error fetching property alerts");
        } finally {
            setAlertsLoader(false);
        }
    };

    useEffect(() => {
        if (activeTab === "notifications") {
            fetchNotifications(1);
        } else if (activeTab === "property_alerts") {
            fetchPropertyAlerts(1);
        }
    }, [activeTab]);

    const handleNotificationClick = async (notificationId: string) => {
        try {
            await markAsRead(notificationId);
            setNotifications(notifications.map(n => 
                n.id === notificationId ? { ...n, read: true } : n
            ));
        } catch (error) {
            toast.error("Failed to mark as read.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
                </div>
                <p className="text-gray-600">Stay updated with your latest notifications and property alerts</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="property_alerts" className="flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        Property Alerts
                    </TabsTrigger>
                </TabsList>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                    {notificationsLoader ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading notifications...</p>
                            </div>
                        </div>
                    ) : notifications.length > 0 ? (
                        notifications.map((item) => (
                            <Card key={item.id} className="hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-4">
                                    <Link 
                                        href={item.link || '#'}
                                        onClick={() => handleNotificationClick(item.id)}
                                        className="flex items-start gap-4 group"
                                    >
                                        <Avatar 
                                            imgUrl={item.sender?.avatar} 
                                            userName={item.sender?.name}
                                            sizeClass="size-12" 
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {item.sender?.name || 'System'}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {!item.read && (
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs">
                                                            New
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{item.message}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(item.createdAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                            <p className="text-gray-500">You'll see your notifications here when you receive them.</p>
                        </div>
                    )}
                </TabsContent>

                {/* Property Alerts Tab */}
                <TabsContent value="property_alerts" className="space-y-4">
                    {alertsLoader ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading property alerts...</p>
                            </div>
                        </div>
                    ) : propertyAlerts.length > 0 ? (
                        propertyAlerts.map((item, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                                <CardContent className="p-4">
                                    <Link 
                                        href="/property"
                                        className="flex items-center justify-between group"
                                    >
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Home className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                    {item.property.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">{item.property.address}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {item.message}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                                                <DollarSign className="w-5 h-5" />
                                                {item.property.price.toLocaleString()}
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-600 text-xs mt-1">
                                                New Alert
                                            </Badge>
                                        </div>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="p-4 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                <Home className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No property alerts</h3>
                            <p className="text-gray-500 mb-4">Set up property alerts to get notified about new listings and price changes.</p>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Create Alert
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AllNotifications;
