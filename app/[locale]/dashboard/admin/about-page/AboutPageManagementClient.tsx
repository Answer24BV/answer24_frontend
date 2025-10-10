'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AboutPageEditor } from '@/components/admin/AboutPageEditor';

export default function AboutPageManagement() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(true);
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    loadAboutPage();
  }, [locale]);

  const loadAboutPage = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/about');
      if (!response.ok) {
        throw new Error('Failed to load about page content');
      }
      const data = await response.json();
      setAboutData(data);
    } catch (error) {
      console.error('Error loading about page:', error);
      toast.error('Error loading about page');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (content: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Failed to save about page content');
      }

      toast.success('About page content saved successfully');
    } catch (error) {
      console.error('Error saving about page:', error);
      toast.error('Error saving about page');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !aboutData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">About Page Editor</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit About Page Content</CardTitle>
        </CardHeader>
        <CardContent>
          {aboutData && (
            <AboutPageEditor 
              initialData={aboutData} 
              onSave={handleSave} 
              isLoading={isLoading} 
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
