'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { legalPagesService, LegalPage } from '@/lib/legalPages';
import { useTranslations } from '@/hooks/useTranslations';
import { Edit, Save, X, Clock, User } from 'lucide-react';

// Mock user role - in real app, this would come from auth context
const mockUser = {
  role: 'admin', // Change to 'user' to test non-admin view
  name: 'Admin User'
};

export default function LegalPageView() {
  const params = useParams();
  const locale = useLocale();
  const slug = params.slug as string;
  
  const [page, setPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  
  const { t: dynamicT } = useTranslations();

  useEffect(() => {
    loadPage();
  }, [slug, locale]);

  const loadPage = async () => {
    setIsLoading(true);
    try {
      const pageData = await legalPagesService.getPageBySlug(slug, locale);
      if (pageData) {
        setPage(pageData);
        setEditTitle(pageData.title);
        setEditContent(pageData.content);
      }
    } catch (error) {
      console.error('Error loading page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (page) {
      setEditTitle(page.title);
      setEditContent(page.content);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    
    setSaveStatus('Saving...');
    try {
      const success = await legalPagesService.updatePage(
        page.slug,
        page.language,
        { title: editTitle, content: editContent }
      );
      
      if (success) {
        setSaveStatus('Saved successfully!');
        setIsEditing(false);
        // Reload the page to get updated data
        await loadPage();
      } else {
        setSaveStatus('Failed to save');
      }
    } catch (error) {
      setSaveStatus('Error saving');
      console.error('Save error:', error);
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mx-auto"></div>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                <div className="h-4 bg-gray-200 rounded w-10/12"></div>
                {i % 2 === 0 && (
                  <div className="h-4 bg-gray-200 rounded w-9/12"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <X className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            The requested legal page could not be found.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  const isAdmin = mockUser.role === 'user';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-26 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-blue-100 p-2 rounded-lg mr-3">
                      <Edit className="h-5 w-5 text-blue-600" />
                    </span>
                    {dynamicT('admin.controls', 'Admin Controls')}
                  </h2>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1.5" />
                    {dynamicT('common.last_updated', 'Last updated')}: {new Date(page.last_updated_at).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {dynamicT('common.edit', 'Edit Page')}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {dynamicT('common.save', 'Save Changes')}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {dynamicT('common.cancel', 'Cancel')}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {saveStatus && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  saveStatus.includes('success') ? 'bg-green-50 text-green-700' : 
                  saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {saveStatus}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {isEditing && isAdmin ? (
            <div className="p-6 md:p-8">
              {/* Title Editor */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dynamicT('admin.page_title', 'Page Title')}
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Content Editor */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {dynamicT('admin.page_content', 'Page Content')}
                  </label>
                  <span className="text-xs text-gray-500">
                    {dynamicT('admin.html_supported', 'HTML supported')}
                  </span>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  rows={20}
                  placeholder={dynamicT('admin.enter_html_content', 'Enter your content here. HTML is supported.')}
                />
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <article className="prose prose-blue max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>
                <div 
                  className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              </article>
              
              <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                <div className="flex items-center mb-2 sm:mb-0">
                  <User className="h-4 w-4 mr-1.5 text-gray-400" />
                  {dynamicT('common.last_updated_by', 'Last updated by')}: {page.last_updated_by || 'System'}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                  {new Date(page.last_updated_at).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
