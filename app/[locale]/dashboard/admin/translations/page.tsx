'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { translationService, TranslationKey } from '@/lib/translations';
import { useTranslations as useNextIntlTranslations } from 'next-intl';

export default function TranslationManagementPage() {
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string>('');
  
  const { t: dynamicT } = useTranslations();
  const t = useNextIntlTranslations();

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setIsLoading(true);
    try {
      const [enTranslations, nlTranslations] = await Promise.all([
        translationService.getTranslations('en'),
        translationService.getTranslations('nl')
      ]);

      // Combine translations into a structured format
      const keys = new Set([...Object.keys(enTranslations), ...Object.keys(nlTranslations)]);
      const translationData: TranslationKey[] = Array.from(keys).map(key => ({
        key,
        en: enTranslations[key] || '',
        nl: nlTranslations[key] || ''
      }));

      setTranslationKeys(translationData);
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (key: string, language: 'en' | 'nl', text: string) => {
    setSaveStatus('Saving...');
    try {
      const success = await translationService.updateTranslation(key, language, text);
      if (success) {
        setSaveStatus('Saved successfully!');
        // Update local state
        setTranslationKeys(prev => 
          prev.map(item => 
            item.key === key ? { ...item, [language]: text } : item
          )
        );
      } else {
        setSaveStatus('Failed to save');
      }
    } catch (error) {
      setSaveStatus('Error saving');
      console.error('Save error:', error);
    }
    
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handleAddNewKey = async () => {
    if (!newKey.trim()) return;
    
    const newTranslation: TranslationKey = {
      key: newKey,
      en: '',
      nl: ''
    };
    
    setTranslationKeys(prev => [...prev, newTranslation]);
    setNewKey('');
    setEditingKey(newKey);
  };

  const filteredKeys = translationKeys.filter(item => 
    item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading translations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-26">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {dynamicT('admin.title', 'Translation Management')}
        </h1>
        
        {saveStatus && (
          <div className={`mb-4 p-3 rounded ${
            saveStatus.includes('success') ? 'bg-green-100 text-green-800' : 
            saveStatus.includes('Error') || saveStatus.includes('Failed') ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {saveStatus}
          </div>
        )}

        {/* Search and Add New Key */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder={dynamicT('admin.search_placeholder', 'Search translation key...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="New translation key (e.g., header.new_text)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddNewKey}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {dynamicT('admin.add_key', 'Add New Key')}
            </button>
          </div>
        </div>

        {/* Translation Keys Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dynamicT('admin.key', 'Key')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dynamicT('admin.english', 'English')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {dynamicT('admin.dutch', 'Dutch')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredKeys.map((item) => (
                <TranslationRow
                  key={item.key}
                  translation={item}
                  isEditing={editingKey === item.key}
                  onEdit={() => setEditingKey(item.key)}
                  onSave={handleSave}
                  onCancel={() => setEditingKey(null)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {filteredKeys.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No translations found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}

interface TranslationRowProps {
  translation: TranslationKey;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (key: string, language: 'en' | 'nl', text: string) => void;
  onCancel: () => void;
}

function TranslationRow({ translation, isEditing, onEdit, onSave, onCancel }: TranslationRowProps) {
  const [enText, setEnText] = useState(translation.en);
  const [nlText, setNlText] = useState(translation.nl);
  const { t: dynamicT } = useTranslations();

  useEffect(() => {
    setEnText(translation.en);
    setNlText(translation.nl);
  }, [translation]);

  const handleSave = () => {
    if (enText !== translation.en) {
      onSave(translation.key, 'en', enText);
    }
    if (nlText !== translation.nl) {
      onSave(translation.key, 'nl', nlText);
    }
    onCancel();
  };

  if (isEditing) {
    return (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {translation.key}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <textarea
            value={enText}
            onChange={(e) => setEnText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <textarea
            value={nlText}
            onChange={(e) => setNlText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-900"
          >
            {dynamicT('admin.save', 'Save')}
          </button>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {translation.key}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-xs truncate" title={translation.en}>
          {translation.en || <span className="text-gray-400 italic">Not set</span>}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        <div className="max-w-xs truncate" title={translation.nl}>
          {translation.nl || <span className="text-gray-400 italic">Not set</span>}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
      </td>
    </tr>
  );
}
