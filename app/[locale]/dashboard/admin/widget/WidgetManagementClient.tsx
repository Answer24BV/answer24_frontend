"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { tokenUtils } from '@/utils/auth';
import { 
  Settings, 
  Key, 
  Globe, 
  Palette, 
  MessageSquare, 
  Wallet, 
  Gift, 
  FileText,
  Copy,
  RotateCcw,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';

interface WidgetSettings {
  id: string;
  company_id: string;
  public_key: string;
  allowed_domains: string[];
  theme: {
    mode: 'auto' | 'light' | 'dark';
    primary: string;
    foreground: string;
    background: string;
    radius: number;
    fontFamily: string;
    logoUrl?: string;
  };
  behavior: {
    position: 'right' | 'left';
    openOnLoad: boolean;
    openOnExitIntent: boolean;
    openOnInactivityMs: number;
    zIndex: number;
  };
  features: {
    chat: boolean;
    wallet: boolean;
    offers: boolean;
    leadForm: boolean;
  };
  i18n: {
    default: string;
    strings: Record<string, string>;
  };
  integrations: {
    ga4?: {
      measurementId: string;
    };
    mollie?: {
      apiKey: string;
    };
  };
  visibility_rules: {
    includePaths: string[];
    excludePaths: string[];
    minCartValue: number;
  };
  rate_limit_per_min: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export default function WidgetManagementClient() {
  const [settings, setSettings] = useState<WidgetSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newStringKey, setNewStringKey] = useState('');
  const [newStringValue, setNewStringValue] = useState('');

  // Load widget settings
  useEffect(() => {
    loadWidgetSettings();
  }, []);

  const loadWidgetSettings = async () => {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        console.log('[Widget Settings] No token found');
        toast.error('Authentication required');
        setLoading(false);
        // Try to load from localStorage as fallback
        checkLocalStorageFallback();
        return;
      }

      console.log('[Widget Settings] Loading settings with token:', token.substring(0, 20) + '...');

      // Use local Next.js API route
      const response = await fetch('/api/v1/widget/settings', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('[Widget Settings] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[Widget Settings] Settings loaded:', data);
        setSettings(data.settings);
      } else if (response.status === 404) {
        // No widget settings found, create default settings on the backend
        console.log('[Widget Settings] No settings found (404), creating default settings...');
        await createDefaultSettingsOnBackend();
      } else if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ error: 'Authentication failed' }));
        console.error('[Widget Settings] Authentication failed (401):', errorData);
        toast.error('Authentication failed. Please log in again.');
        // Fallback to local storage
        checkLocalStorageFallback();
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to load widget settings' }));
        console.error('[Widget Settings] Error response:', errorData);
        toast.error(errorData.error || 'Failed to load widget settings');
        // Fallback to local storage
        checkLocalStorageFallback();
      }
    } catch (error) {
      console.error('[Widget Settings] Error loading widget settings:', error);
      // If API is not available, check for locally saved settings
      console.log('[Widget Settings] API not available, checking for locally saved settings...');
      checkLocalStorageFallback();
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorageFallback = () => {
    const localSettings = localStorage.getItem('widget-settings');
    if (localSettings) {
      try {
        setSettings(JSON.parse(localSettings));
        toast.info('Loaded widget settings from local storage');
      } catch (parseError) {
        console.error('Error parsing local settings:', parseError);
        createDefaultSettings();
      }
    } else {
      createDefaultSettings();
    }
  };

  const createDefaultSettingsOnBackend = async () => {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        createDefaultSettings();
        return;
      }

      const defaultSettings = {
        allowed_domains: ['localhost', '127.0.0.1', 'localhost:3000'],
        theme: {
          mode: 'auto',
          primary: '#0059ff',
          foreground: '#0f172a',
          background: '#ffffff',
          radius: 14,
          fontFamily: 'Inter, ui-sans-serif',
          logoUrl: 'https://cdn.answer24.nl/assets/tenants/default/logo.svg'
        },
        behavior: {
          position: 'right',
          openOnLoad: false,
          openOnExitIntent: true,
          openOnInactivityMs: 0,
          zIndex: 2147483000
        },
        features: {
          chat: true,
          wallet: true,
          offers: false,
          leadForm: false
        },
        i18n: {
          default: 'en-US',
          strings: {
            'cta.open': 'Ask & Save',
            'chat.welcome': 'Hi there! How can I help you today?',
            'chat.placeholder': 'Type your message...',
            'chat.send': 'Send',
            'chat.settings': 'Settings',
            'chat.close': 'Close'
          }
        },
        integrations: {
          ga4: {
            measurementId: 'G-XXXX'
          }
        },
        visibility_rules: {
          includePaths: ['*'],
          excludePaths: [],
          minCartValue: 0
        },
        rate_limit_per_min: 60
      };

      const response = await fetch('/api/v1/widget/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(defaultSettings)
      });

      if (response.ok) {
        const data = await response.json();
        // Reload settings to get the full object with ID, public_key, etc.
        await loadWidgetSettings();
        toast.success('Default widget settings created successfully!');
      } else {
        // If backend creation fails, use local defaults
        console.log('Failed to create settings on backend, using local defaults');
        createDefaultSettings();
      }
    } catch (error) {
      console.error('Error creating default settings on backend:', error);
      createDefaultSettings();
    }
  };

  const createDefaultSettings = () => {
    const defaultSettings: WidgetSettings = {
      id: '1',
      company_id: 'default',
      public_key: 'PUB_' + Math.random().toString(36).substr(2, 9),
      allowed_domains: ['localhost', '127.0.0.1'],
      theme: {
        mode: 'auto',
        primary: '#0059ff',
        foreground: '#0f172a',
        background: '#ffffff',
        radius: 14,
        fontFamily: 'Inter, ui-sans-serif',
        logoUrl: 'https://cdn.answer24.nl/assets/tenants/default/logo.svg'
      },
      behavior: {
        position: 'right',
        openOnLoad: false,
        openOnExitIntent: true,
        openOnInactivityMs: 0,
        zIndex: 2147483000
      },
      features: {
        chat: true,
        wallet: true,
        offers: false,
        leadForm: false
      },
      i18n: {
        default: 'en-US',
        strings: {
          'cta.open': 'Ask & Save',
          'chat.welcome': 'Hi there! How can I help you today?',
          'chat.placeholder': 'Type your message...',
          'chat.send': 'Send',
          'chat.settings': 'Settings',
          'chat.close': 'Close'
        }
      },
      integrations: {
        ga4: {
          measurementId: 'G-XXXX'
        }
      },
      visibility_rules: {
        includePaths: ['*'],
        excludePaths: [],
        minCartValue: 0
      },
      rate_limit_per_min: 60,
      version: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setSettings(defaultSettings);
    toast.info('Created default widget settings. You can now customize them!');
  };

  const saveWidgetSettings = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      const token = tokenUtils.getToken();
      // Use local Next.js API route
      const response = await fetch('/api/v1/widget/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[Widget Settings] Settings saved successfully:', data);
        toast.success('Widget settings saved successfully!');
        await loadWidgetSettings(); // Reload to get updated version
        
        // Also save to localStorage for widget to use
        localStorage.setItem('widget-settings', JSON.stringify(settings));
        
        // Notify all widgets to reload settings
        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
        
        // Show public key info
        if (settings.public_key) {
          console.log('✅ Your widget public key:', settings.public_key);
          console.log('💡 Use this key in your demo: http://localhost:3000/widget/demo.html');
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save settings' }));
        console.error('[Widget Settings] Save failed:', errorData);
        // If backend is not available, save locally
        console.log('[Widget Settings] Backend not available, saving settings locally...');
        localStorage.setItem('widget-settings', JSON.stringify(settings));
        toast.warning('Widget settings saved locally! (Backend not available)');
        // Notify all widgets to reload settings
        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
      }
    } catch (error) {
      console.error('[Widget Settings] Error saving widget settings:', error);
      // If API is not available, save locally
      console.log('[Widget Settings] API not available, saving settings locally...');
      localStorage.setItem('widget-settings', JSON.stringify(settings));
      toast.warning('Widget settings saved locally! (Backend not available)');
      // Notify all widgets to reload settings
      window.dispatchEvent(new CustomEvent('widget-settings-updated'));
    } finally {
      setSaving(false);
    }
  };

  const rotatePublicKey = async () => {
    try {
      const token = tokenUtils.getToken();
      // Use local Next.js API route
      const response = await fetch('/api/v1/widget/rotate-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => prev ? { ...prev, public_key: data.new_public_key } : null);
        toast.success('Public key rotated successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to rotate public key' }));
        toast.error(errorData.error || 'Failed to rotate public key');
      }
    } catch (error) {
      console.error('Error rotating public key:', error);
      toast.error('Failed to rotate public key');
    }
  };

  const copyPublicKey = () => {
    if (settings?.public_key) {
      navigator.clipboard.writeText(settings.public_key);
      toast.success('Public key copied to clipboard!');
    }
  };

  const copyEmbedCode = () => {
    if (settings?.public_key) {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const embedCode = `<!-- Add this before closing </body> tag on your website -->
<script src="${baseUrl}/widget/answer24-widget.js" data-public-key="${settings.public_key}"></script>`;
      navigator.clipboard.writeText(embedCode);
      toast.success('Embed code copied to clipboard!');
    }
  };

  const addDomain = () => {
    if (newDomain.trim() && settings) {
      setSettings(prev => prev ? {
        ...prev,
        allowed_domains: [...prev.allowed_domains, newDomain.trim()]
      } : null);
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    if (settings) {
      setSettings(prev => prev ? {
        ...prev,
        allowed_domains: prev.allowed_domains.filter(d => d !== domain)
      } : null);
    }
  };

  const addString = () => {
    if (newStringKey.trim() && newStringValue.trim() && settings) {
      setSettings(prev => prev ? {
        ...prev,
        i18n: {
          ...prev.i18n,
          strings: {
            ...prev.i18n.strings,
            [newStringKey.trim()]: newStringValue.trim()
          }
        }
      } : null);
      setNewStringKey('');
      setNewStringValue('');
    }
  };

  const removeString = (key: string) => {
    if (settings) {
      const newStrings = { ...settings.i18n.strings };
      delete newStrings[key];
      setSettings(prev => prev ? {
        ...prev,
        i18n: {
          ...prev.i18n,
          strings: newStrings
        }
      } : null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No widget settings found. Contact support to set up your widget.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Widget Management</h1>
          <p className="text-gray-600">Configure your Answer24 widget settings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadWidgetSettings} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveWidgetSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Public Key & Embed Code
              </CardTitle>
              <CardDescription>
                Your widget's public key and embed code for integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Public Key</Label>
                <div className="flex gap-2">
                  <Input
                    value={settings.public_key}
                    type={showPublicKey ? 'text' : 'password'}
                    readOnly
                    className="font-mono"
                  />
                  <Button size="sm" variant="outline" onClick={() => setShowPublicKey(!showPublicKey)}>
                    {showPublicKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={copyPublicKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={rotatePublicKey}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Embed Code (Copy & Paste on Your Website)</Label>
                <div className="flex flex-col gap-2">
                  <Textarea
                    value={`<!-- Add this before closing </body> tag on your website -->
<script src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/widget/answer24-widget.js" data-public-key="${settings.public_key}" data-api-base="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/v1"></script>`}
                    readOnly
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyEmbedCode} className="flex-1">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Embed Code
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        // Update demo.html with current public key and open it with cache buster
                        const demoUrl = `${window.location.origin}/widget/demo.html?key=${settings.public_key}&_t=${Date.now()}`;
                        window.open(demoUrl, '_blank');
                      }}
                      className="flex-1"
                    >
                      View Demo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 The demo page will automatically use your saved settings. Make sure to save your changes first!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Allowed Domains
              </CardTitle>
              <CardDescription>
                Domains where your widget can be embedded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com or *.example.com"
                />
                <Button onClick={addDomain}>Add Domain</Button>
              </div>
              <div className="space-y-2">
                {settings.allowed_domains.map((domain, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-mono text-sm">{domain}</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeDomain(domain)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <Input
                    type="color"
                    value={settings.theme.primary}
                    onChange={(e) => {
                      const newSettings = settings ? {
                        ...settings,
                        theme: { ...settings.theme, primary: e.target.value }
                      } : null;
                      setSettings(newSettings);
                      
                      // Live preview: update localStorage and dispatch event immediately
                      if (newSettings) {
                        localStorage.setItem('widget-settings', JSON.stringify(newSettings));
                        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <Input
                    type="color"
                    value={settings.theme.background}
                    onChange={(e) => {
                      const newSettings = settings ? {
                        ...settings,
                        theme: { ...settings.theme, background: e.target.value }
                      } : null;
                      setSettings(newSettings);
                      
                      // Live preview: update localStorage and dispatch event immediately
                      if (newSettings) {
                        localStorage.setItem('widget-settings', JSON.stringify(newSettings));
                        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Border Radius</Label>
                  <Input
                    type="number"
                    value={settings.theme.radius}
                    onChange={(e) => {
                      const newSettings = settings ? {
                        ...settings,
                        theme: { ...settings.theme, radius: parseInt(e.target.value) }
                      } : null;
                      setSettings(newSettings);
                      
                      // Live preview: update localStorage and dispatch event immediately
                      if (newSettings) {
                        localStorage.setItem('widget-settings', JSON.stringify(newSettings));
                        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Input
                    value={settings.theme.fontFamily}
                    onChange={(e) => {
                      const newSettings = settings ? {
                        ...settings,
                        theme: { ...settings.theme, fontFamily: e.target.value }
                      } : null;
                      setSettings(newSettings);
                      
                      // Live preview: update localStorage and dispatch event immediately
                      if (newSettings) {
                        localStorage.setItem('widget-settings', JSON.stringify(newSettings));
                        window.dispatchEvent(new CustomEvent('widget-settings-updated'));
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open on Load</Label>
                  <p className="text-sm text-gray-500">Automatically open widget when page loads</p>
                </div>
                <Switch
                  checked={settings.behavior.openOnLoad}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    behavior: { ...prev.behavior, openOnLoad: checked }
                  } : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Open on Exit Intent</Label>
                  <p className="text-sm text-gray-500">Open widget when user tries to leave</p>
                </div>
                <Switch
                  checked={settings.behavior.openOnExitIntent}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    behavior: { ...prev.behavior, openOnExitIntent: checked }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select
                  value={settings.behavior.position}
                  onValueChange={(value) => {
                    const newSettings = settings ? {
                      ...settings,
                      behavior: { ...settings.behavior, position: value as 'right' | 'left' }
                    } : null;
                    setSettings(newSettings);
                    
                    // Live preview: update localStorage and dispatch event immediately
                    if (newSettings) {
                      try {
                        localStorage.setItem('widget-settings', JSON.stringify(newSettings));
                        // Only dispatch event if we're not on the settings page itself (to avoid conflicts)
                        if (!window.location.pathname.includes('/dashboard/admin/widget')) {
                          window.dispatchEvent(new CustomEvent('widget-settings-updated'));
                        }
                      } catch (e) {
                        console.warn('Could not update localStorage:', e);
                      }
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Feature Toggles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <div>
                    <Label>Chat</Label>
                    <p className="text-sm text-gray-500">Enable chat functionality</p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.chat}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    features: { ...prev.features, chat: checked }
                  } : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <div>
                    <Label>Wallet</Label>
                    <p className="text-sm text-gray-500">Enable A-Points wallet</p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.wallet}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    features: { ...prev.features, wallet: checked }
                  } : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <div>
                    <Label>Offers</Label>
                    <p className="text-sm text-gray-500">Show special offers</p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.offers}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    features: { ...prev.features, offers: checked }
                  } : null)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  <div>
                    <Label>Lead Form</Label>
                    <p className="text-sm text-gray-500">Enable lead capture form</p>
                  </div>
                </div>
                <Switch
                  checked={settings.features.leadForm}
                  onCheckedChange={(checked) => setSettings(prev => prev ? {
                    ...prev,
                    features: { ...prev.features, leadForm: checked }
                  } : null)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Rate Limit (requests per minute)</Label>
                <Input
                  type="number"
                  value={settings.rate_limit_per_min}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    rate_limit_per_min: parseInt(e.target.value)
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input
                  value={settings.version}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Google Analytics 4 Measurement ID</Label>
                <Input
                  value={settings.integrations.ga4?.measurementId || ''}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    integrations: {
                      ...prev.integrations,
                      ga4: { measurementId: e.target.value }
                    }
                  } : null)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
              <div className="space-y-2">
                <Label>Mollie API Key</Label>
                <Input
                  type="password"
                  value={settings.integrations.mollie?.apiKey || ''}
                  onChange={(e) => setSettings(prev => prev ? {
                    ...prev,
                    integrations: {
                      ...prev.integrations,
                      mollie: { apiKey: e.target.value }
                    }
                  } : null)}
                  placeholder="live_xxxxxxxxxx"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
