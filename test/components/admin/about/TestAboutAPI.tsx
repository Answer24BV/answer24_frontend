'use client';

import { useState, useEffect } from 'react';

export default function TestAboutAPI() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: ''
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/about');
      if (!response.ok) {
        throw new Error('Failed to fetch about data');
      }
      const data = await response.json();
      setAboutData(data);
      setFormData({
        title: data.title || '',
        subtitle: data.subtitle || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/admin/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...aboutData,
          title: formData.title,
          subtitle: formData.subtitle
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update about data');
      }

      // Refresh the data
      await fetchAboutData();
      alert('About page updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update about page');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !aboutData) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test About Page API</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Current About Page Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(aboutData, null, 2)}
        </pre>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Update About Page:</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle:
            </label>
            <textarea
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Updating...' : 'Update About Page'}
          </button>
        </form>
      </div>
    </div>
  );
}
