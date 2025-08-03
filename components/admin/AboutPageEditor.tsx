"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

interface AboutPageContent {
  title: string;
  subtitle: string;
  ctaButton: string;
  story: {
    title: string;
    content: string;
  };
  mission: {
    title: string;
    description: string;
  };
  vision: {
    title: string;
    description: string;
  };
  values: {
    title: string;
    subtitle: string;
    values: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
}

interface AboutPageEditorProps {
  initialData: AboutPageContent;
  onSave: (content: AboutPageContent) => Promise<void>;
  isLoading: boolean;
}

export function AboutPageEditor({ initialData, onSave, isLoading }: AboutPageEditorProps) {
  const t = useTranslations("AboutPage")
  const [activeTab, setActiveTab] = useState("general")
  const [content, setContent] = useState<AboutPageContent>(initialData)

  // Remove the local loading effect since we're getting data from props

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSave(content);
      toast.success('Success', {
        description: 'About page content saved successfully',
      });
    } catch (error) {
      console.error('Error saving about page:', error);
      toast.error('Error', {
        description: 'Failed to save about page content',
      });
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value }
    }))
  }

  if (isLoading && !content.title) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit About Page</h1>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </> : <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="story">Our Story</TabsTrigger>
          <TabsTrigger value="mission-vision">Mission & Vision</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-6">
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input value={content.title} onChange={(e) => setContent({...content, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <Textarea value={content.subtitle} onChange={(e) => setContent({...content, subtitle: e.target.value})} rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <Input value={content.ctaButton} onChange={(e) => setContent({...content, ctaButton: e.target.value})} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="story" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Our Story</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input value={content.story.title} onChange={(e) => handleChange('story', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <Textarea value={content.story.content} onChange={(e) => handleChange('story', 'content', e.target.value)} rows={6} />
                  <p className="text-xs text-muted-foreground mt-1">Use {'<strong>text</strong>'} for bold text and {'<br/>'} for line breaks</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mission-vision" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input value={content.mission.title} onChange={(e) => handleChange('mission', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea value={content.mission.description} onChange={(e) => handleChange('mission', 'description', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input value={content.vision.title} onChange={(e) => handleChange('vision', 'title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea value={content.vision.description} onChange={(e) => handleChange('vision', 'description', e.target.value)} rows={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
