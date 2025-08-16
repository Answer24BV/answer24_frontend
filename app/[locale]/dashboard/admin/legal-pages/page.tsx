"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { legalPagesService, LegalPage } from "@/lib/legalPages";
import { useTranslations } from "@/hooks/useTranslations";
import { toast } from "react-toastify";
import { Plus, Loader2 } from "lucide-react";
import { LegalPageEditor } from "@/components/admin/LegalPageEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DEFAULT_LANGUAGES = ["en", "nl"];

export default function LegalPagesManagement() {
  const locale = useLocale();
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(locale);
  const { t } = useTranslations();

  // Available languages - could be fetched from settings in the future
  const availableLanguages = DEFAULT_LANGUAGES;

  useEffect(() => {
    loadPages();
  }, [locale]);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const pagesData = await legalPagesService.getAllPages(locale);
      setPages(pagesData);
    } catch (error) {
      console.error("Error loading legal pages:", error);
      toast("Error loading legal pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    const newPage: LegalPage = {
      id: "new-" + Date.now(),
      slug: "",
      title: "",
      content: "",
      language: activeLanguage,
      last_updated_at: new Date().toISOString(),
      last_updated_by: "current-user", // This should be replaced with actual user info
      is_active: true,
    };

    setPages((prev) => [newPage, ...prev]);
    setIsCreating(true);
  };

  const handleSavePage = async (pageData: LegalPage): Promise<boolean> => {
    try {
      let success: boolean;

      if (pageData.id?.startsWith("new-")) {
        // Handle new page
        const { id, ...newPage } = pageData;
        const created = await legalPagesService.createPage(newPage);
        success = !!created;
      } else {
        // Handle update
        success = await legalPagesService.updatePage(
          pageData.slug,
          pageData.language,
          {
            title: pageData.title,
            content: pageData.content,
          }
        );
      }

      if (success) {
        await loadPages();
        toast("Page saved successfully");
        return true;
      } else {
        throw new Error("Failed to save page");
      }
    } catch (error) {
      console.error("Error saving page:", error);
      toast("Error saving page");
      return false;
    }
  };

  const handleDeletePage = async (slug: string): Promise<void> => {
    try {
      await legalPagesService.deletePage(slug, activeLanguage);
      await loadPages();
      toast("Page deleted successfully");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast("Error deleting page");
    }
  };

  // Filter pages based on search query and active language
  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = page.language === activeLanguage;
    return matchesSearch && matchesLanguage;
  });

  // Get pages for the currently active language tab
  const languagePages = pages.filter(
    (page) => page.language === activeLanguage
  );
  const activePage = pages.find((p) => p.id?.startsWith("new-"));

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Show empty state if no pages exist
  if (pages.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">No legal pages found</h1>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first legal page
          </p>
          <Button onClick={handleCreateNew} disabled={isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Legal Pages</h1>
          <p className="text-muted-foreground">
            Manage your legal documentation and policies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              placeholder="Search pages..."
              className="w-full md:w-64 pr-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
          <Button onClick={handleCreateNew} disabled={isLoading || isCreating}>
            <Plus className="h-4 w-4 mr-2" />
            New Page
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <Tabs
            value={activeLanguage}
            onValueChange={setActiveLanguage}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                {availableLanguages.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {filteredPages.length}{" "}
                {filteredPages.length === 1 ? "page" : "pages"} in{" "}
                {activeLanguage.toUpperCase()}
              </div>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Show new page editor if creating */}
            {activePage && (
              <LegalPageEditor
                key={activePage.id}
                page={activePage}
                onSave={handleSavePage}
                onDelete={handleDeletePage}
                availableLanguages={availableLanguages}
              />
            )}

            {/* Show empty state or page list */}
            {filteredPages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground mb-2">
                  No pages found for "{searchQuery}" in{" "}
                  {activeLanguage.toUpperCase()}
                </div>
                <Button
                  variant="outline"
                  onClick={handleCreateNew}
                  disabled={isCreating}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create a new page
                </Button>
              </div>
            ) : (
              filteredPages
                .filter((page) => !page.id?.startsWith("new-"))
                .map((page) => (
                  <LegalPageEditor
                    key={`${page.slug}-${page.language}`}
                    page={page}
                    onSave={handleSavePage}
                    onDelete={handleDeletePage}
                    availableLanguages={availableLanguages}
                  />
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
