'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { legalPagesService, LegalPage } from '@/lib/legalPages';
import { useTranslations } from '@/hooks/useTranslations';
import { Link } from '@/i18n/navigation';

export default function LegalPagesManagement() {
  const locale = useLocale();
  const [pages, setPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPageData, setNewPageData] = useState({
    slug: '',
    title: '',
    content: '',
    language: locale
  });
  const [saveStatus, setSaveStatus] = useState('');

  const { t: dynamicT } = useTranslations();

  useEffect(() => {
    loadPages();
  }, [locale]);

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const pagesData = await legalPagesService.getAllPages(locale);
      setPages(pagesData);
    } catch (error) {
      console.error('Error loading legal pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setNewPageData({
      slug: '',
      title: '',
      content: '',
      language: locale
    });
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setNewPageData({
      slug: '',
      title: '',
      content: '',
      language: locale
    });
  };

  const handleSaveNew = async () => {
    if (!newPageData.slug || !newPageData.title) {
      setSaveStatus('Please fill in slug and title');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setSaveStatus('Creating...');
    try {
      const created = await legalPagesService.createPage(newPageData);
      if (created) {
        setSaveStatus('Page created successfully!');
        setIsCreating(false);
        setNewPageData({
          slug: '',
          title: '',
          content: '',
          language: locale
        });
        await loadPages();
      } else {
        setSaveStatus('Failed to create page');
      }
    } catch (error) {
      setSaveStatus('Error creating page');
      console.error('Create error:', error);
    }

    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    setSaveStatus('Deleting...');
    try {
      const success = await legalPagesService.deletePage(slug, locale);
      if (success) {
        setSaveStatus('Page deleted successfully!');
        await loadPages();
      } else {
        setSaveStatus('Failed to delete page');
      }
    } catch (error) {
      setSaveStatus('Error deleting page');
      console.error('Delete error:', error);
    }

    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-26">
        <div className="text-center">Loading legal pages...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-26">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {dynamicT('admin.legal_pages_title', 'Legal Pages Management')}
          </h1>
          <button
            onClick={handleCreateNew}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {dynamicT('admin.create_new_page', 'Create New Page')}
          </button>
        </div>

        {saveStatus && (
          <div className={`mb-4 p-3 rounded ${
            saveStatus.includes('success') ? 'bg-green-100 text-green-800' : 
            saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {saveStatus}
          </div>
        )}

        {/* Create New Page Form */}
        {isCreating && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Create New Legal Page</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL identifier)
                </label>
                <input
                  type="text"
                  value={newPageData.slug}
                  onChange={(e) => setNewPageData({...newPageData, slug: e.target.value})}
                  placeholder="e.g., privacy-policy, terms-of-service"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newPageData.title}
                  onChange={(e) => setNewPageData({...newPageData, title: e.target.value})}
                  placeholder="Page title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (HTML)
                </label>
                <textarea
                  value={newPageData.content}
                  onChange={(e) => setNewPageData({...newPageData, content: e.target.value})}
                  placeholder="Enter HTML content..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  rows={10}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create Page
                </button>
                <button
                  onClick={handleCancelCreate}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {page.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.slug}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.language.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(page.last_updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/legal/${page.slug}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </Link>
                    <Link
                      href={`/legal/${page.slug}`}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(page.slug)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No legal pages found. Create your first page to get started.
          </div>
        )}
      </div>
    </div>
  );
}
