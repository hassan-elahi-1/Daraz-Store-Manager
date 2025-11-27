import React, { useState } from 'react';
import { useAuth } from '../App';
import { StorageService } from '../services/storage';
import { Save, User } from 'lucide-react';

export default function Settings() {
  const { user, login } = useAuth(); // login updates the context
  const [storeLink, setStoreLink] = useState(user?.darazStoreLink || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = { ...user, darazStoreLink: storeLink };
      await StorageService.updateUser(updatedUser);
      login(updatedUser); // Update local context
      setMessage('Settings saved successfully!');
    } catch (error) {
      console.error(error);
      setMessage('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
          <div className="h-16 w-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl font-bold">
            {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Daraz Store URL</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">This link will be displayed on your dashboard for quick access.</p>
            <input
              type="url"
              value={storeLink}
              onChange={(e) => setStoreLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="https://www.daraz.pk/shop/your-store-name"
            />
          </div>

          {message && (
            <p className={`text-sm ${message.includes('success') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}