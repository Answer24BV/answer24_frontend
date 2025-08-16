"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from "@/app/[locale]/actions/faq";

// Types
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  subcategory: string;
  tags?: string[];
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type FAQFormData = {
  question: string;
  answer: string;
  category: string;
  subcategory: string;
  tags: string[];
  [key: string]: string | string[];
};

// Group FAQs by category and subcategory
const groupFAQs = (faqs: FAQItem[]) => {
  const grouped: Record<string, Record<string, FAQItem[]>> = {};

  faqs.forEach((faq) => {
    if (!grouped[faq.category]) {
      grouped[faq.category] = {};
    }
    if (!grouped[faq.category][faq.subcategory]) {
      grouped[faq.category][faq.subcategory] = [];
    }
    grouped[faq.category][faq.subcategory].push(faq);
  });

  return grouped;
};

// Fetch and flatten FAQs from API
const fetchFAQs = async (): Promise<FAQItem[]> => {
  const categories = await getFAQs();
  // Flatten nested API response to flat FAQItem[] for admin
  const flatFaqs: FAQItem[] = [];
  categories.forEach((category) => {
    category.subcategories.forEach((subcategory) => {
      subcategory.items.forEach((item) => {
        flatFaqs.push({
          ...item,
          category: category.name,
          subcategory: subcategory.name,
        });
      });
    });
  });
  return flatFaqs;
};

export function FaqAdmin() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<FAQFormData>({
    question: "",
    answer: "",
    category: "General",
    subcategory: "General",
    tags: [],
  });

  // Get unique categories for tabs
  const categories = useMemo(() => {
    const cats = new Set(faqs.map((faq) => faq.category).filter(Boolean));
    return Array.from(cats);
  }, [faqs]);

  // Group FAQs by category and subcategory
  const groupedFAQs = useMemo(() => groupFAQs(faqs), [faqs]);

  // Filter FAQs based on search term
  const filteredFAQs = useMemo(() => {
    if (!searchTerm.trim()) return faqs;

    const lowerSearch = searchTerm.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowerSearch) ||
        faq.answer.toLowerCase().includes(lowerSearch) ||
        (faq.tags || []).some((tag) => tag.toLowerCase().includes(lowerSearch))
    );
  }, [faqs, searchTerm]);

  // Toggle FAQ item expansion
  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      e.currentTarget.value = "";
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Open edit panel
  const openEditPanel = (faq: FAQItem) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      subcategory: faq.subcategory,
      tags: faq.tags || [],
    });
    setEditingFaq(faq);
    setIsPanelOpen(true);
  };

  // Open create panel
  const openCreatePanel = () => {
    setFormData({
      question: "",
      answer: "",
      category: "",
      subcategory: "",
      tags: [],
    });
    setEditingFaq(null);
    setIsPanelOpen(true);
  };

  // Close panel
  const closePanel = () => {
    setIsPanelOpen(false);
    setEditingFaq(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      if (editingFaq) {
        // Update existing FAQ via API
        // Only send fields accepted by API
        const updated = await updateFAQ(editingFaq.id, token, {
          question: formData.question,
          answer: formData.answer,
          // Remove tags/category/subcategory if not accepted by API type
        } as any); // Type override for API flexibility
        // Transform API result to FAQItem
        const updatedItem: FAQItem = {
          ...updated,
          category: formData.category,
          subcategory: formData.subcategory,
          tags: formData.tags,
        };
        setFaqs((prevFaqs) =>
          prevFaqs.map((faq) => (faq.id === editingFaq.id ? updatedItem : faq))
        );
        toast.success("FAQ updated successfully");
      } else {
        // Create new FAQ via API
        // Only send fields accepted by API
        const created = await createFAQ(token, {
          question: formData.question,
          answer: formData.answer,

          // Remove tags/category/subcategory if not accepted by API type
        } as any); // Type override for API flexibility
        // Transform API result to FAQItem
        const createdItem: FAQItem = {
          ...created,
          category: formData.category,
          subcategory: formData.subcategory,
          tags: formData.tags,
        };
        setFaqs((prevFaqs) => [createdItem, ...prevFaqs]);
        toast.success("FAQ created successfully");
      }
      setIsPanelOpen(false);
      setEditingFaq(null);
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ. Please try again.");
    }
  };

  // Handle delete FAQ
  const handleDelete = async () => {
    if (!editingFaq) return;
    try {
      await deleteFAQ(editingFaq.id);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== editingFaq.id));
      setIsDeleteDialogOpen(false);
      setEditingFaq(null);
      toast.success("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  // Fetch FAQs on component mount
  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFAQs();
        setFaqs(data);
      } catch (error) {
        console.error("Failed to load FAQs:", error);
        toast.error("Failed to load FAQs");
      } finally {
        setIsLoading(false);
      }
    };
    loadFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              FAQ Management
            </h1>
            <p className="text-muted-foreground">
              Manage your frequently asked questions
            </p>
          </div>
          <Button onClick={openCreatePanel} className="gap-2">
            <Plus className="h-4 w-4" />
            Add New FAQ
          </Button>
        </div>

        {/* Search */}
        <div className="mt-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredFAQs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">
              No FAQs found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search to find what you're looking for."
                : "Get started by creating a new FAQ."}
            </p>
            <Button className="mt-4" onClick={openCreatePanel}>
              <Plus className="mr-2 h-4 w-4" />
              Add FAQ
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFAQs).map(([category, subcategories]) => (
              <div key={category} className="space-y-4">
                <button
                  onClick={() => toggleCategory(category)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <h2 className="text-lg font-semibold text-foreground">
                    {category}
                  </h2>
                  {expandedCategories[category] ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                {expandedCategories[category] !== false && (
                  <div className="space-y-4 pl-4">
                    {Object.entries(subcategories).map(
                      ([subcategory, items]) => (
                        <div key={subcategory} className="space-y-2">
                          <h3 className="text-md font-medium text-muted-foreground">
                            {subcategory}
                          </h3>
                          <div className="space-y-2">
                            {items.map((faq) => (
                              <div
                                key={faq.id}
                                className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                              >
                                <div className="flex items-start justify-between">
                                  <button
                                    className="flex-1 text-left"
                                    onClick={() => toggleItem(faq.id)}
                                  >
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-foreground">
                                        {faq.question}
                                      </h4>
                                      <span className="ml-2 text-sm text-muted-foreground">
                                        ({faq.viewCount || 0} views)
                                      </span>
                                    </div>
                                    {expandedItems[faq.id] && (
                                      <div className="mt-2 text-sm text-muted-foreground">
                                        {faq.answer}
                                        {faq.tags && faq.tags.length > 0 && (
                                          <div className="mt-2 flex flex-wrap gap-1">
                                            {faq.tags.map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="secondary"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </button>
                                  <div className="ml-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => openEditPanel(faq)}
                                    >
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => {
                                        setEditingFaq(faq);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit/Create Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-md transform overflow-y-auto bg-background p-6 shadow-lg transition-transform duration-300 ease-in-out ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b pb-4 mt-18">
          <h2 className="text-lg font-semibold">
            {editingFaq ? "Edit FAQ" : "Create New FAQ"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setIsPanelOpen(false);
              setEditingFaq(null);
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="question"
              className="mb-1 block text-sm font-medium"
            >
              Question
            </label>
            <Input
              id="question"
              name="question"
              value={formData.question}
              onChange={handleInputChange}
              placeholder="Enter question"
              required
            />
          </div>

          <div>
            <label htmlFor="answer" className="mb-1 block text-sm font-medium">
              Answer
            </label>
            <Textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleInputChange}
              placeholder="Enter answer"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium"
              >
                Category
              </label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Account"
                required
              />
            </div>
            <div>
              <label
                htmlFor="subcategory"
                className="mb-1 block text-sm font-medium"
              >
                Subcategory
              </label>
              <Input
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                placeholder="e.g., Security"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="mb-1 block text-sm font-medium">
              Tags
            </label>
            <div className="rounded-md border border-input p-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  className="flex-1 border-0 bg-transparent p-1 text-sm outline-none"
                  placeholder="Add a tag and press Enter"
                  onKeyDown={handleTagInput}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPanelOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingFaq ? "Update FAQ" : "Create FAQ"}
            </Button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the FAQ item. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default FaqAdmin;
