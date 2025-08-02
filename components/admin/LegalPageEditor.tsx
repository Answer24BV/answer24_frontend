'use client';

import { useState, useEffect } from 'react';
import { LegalPage } from '@/lib/legalPages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Save, X, Eye, Edit, Trash2 } from 'lucide-react';

interface LegalPageEditorProps {
  page: LegalPage;
  onSave: (page: LegalPage) => Promise<boolean>;
  onDelete: (slug: string) => Promise<void>;
  availableLanguages: string[];
}

export function LegalPageEditor({ page, onSave, onDelete, availableLanguages }: LegalPageEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<LegalPage>({ ...page });
  const [activeTab, setActiveTab] = useState(page.language);
  const [showPreview, setShowPreview] = useState(false);
//   const { toast } = useToast();

  useEffect(() => {
    setFormData({ ...page });
    setActiveTab(page.language);
  }, [page]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast("Error", {
        description: "Title and slug are required",
      });
      return;
    }

    setIsSaving(true);
    try {
      const success = await onSave(formData);
      if (success) {
        toast("Success", {
          description: "Page saved successfully",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast("Error", {
        description: "Failed to save page",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(page.slug);
      toast("Success", {
        description: "Page deleted successfully",
      });
    } catch (error) {
      toast("Error", {
        description: "Failed to delete page",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{page.title}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="h-8 px-2"
            >
              <Eye className="h-4 w-4 mr-1" />
              {showPreview ? 'Hide' : 'Preview'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 px-2"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="h-8 px-2"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <div 
              className="prose max-w-none p-4 border rounded-md bg-muted/20"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : (
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Slug:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">/{page.slug}</code>
              </div>
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">Language:</span>
                <span className="text-foreground">{page.language.toUpperCase()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Last Updated:</span>
                <span className="text-foreground">
                  {new Date(page.last_updated_at).toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 border-primary">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Edit Page</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="h-8 px-2"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug *
              </label>
              <Input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="about-us"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                URL path: /{formData.slug || 'your-slug'}
              </p>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium mb-1">
                Language *
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Page Title"
              required
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium">
                Content *
              </label>
              <div className="text-xs text-muted-foreground">
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={() => {
                    const markdownExample = `# Heading\n\n**Bold** and *italic* text\n\n- List item 1\n- List item 2\n\n[Link](https://example.com)`;
                    setFormData({...formData, content: markdownExample});
                  }}
                >
                  Insert example
                </button>
              </div>
            </div>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter your page content in Markdown format..."
              className="min-h-[200px] font-mono text-sm"
              required
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Supports <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Markdown</a> formatting
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
