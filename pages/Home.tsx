import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { StorageService } from '../services/storage';
import { Product } from '../types';
import { 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  ExternalLink,
  Plus,
  PackageCheck,
  ArrowRight
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      StorageService.getProducts(user.id).then(data => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [user]);

  // Statistics
  const totalProducts = products.length;
  const inStock = products.filter(p => p.stock > 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  
  // Today's additions
  const today = new Date().toISOString().split('T')[0];
  const addedToday = products.filter(p => p.createdAt.startsWith(today)).length;

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-gray-800 dark:from-gray-800 dark:to-black rounded-2xl p-6 sm:p-10 text-white shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Welcome, {user?.firstName} {user?.lastName} 👋
        </h1>
        <p className="text-gray-300 mb-6">Here's what's happening in your store today.</p>
        
        {user?.darazStoreLink ? (
          <a 
            href={user.darazStoreLink} 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Visit Your Daraz Store <ExternalLink size={16} />
          </a>
        ) : (
          <Link to="/settings" className="text-sm text-primary hover:text-orange-400 underline">
            + Add your store link in settings
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalProducts}</h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <ShoppingBag size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Stock</p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{inStock}</h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <PackageCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Added Today</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{addedToday}</h3>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Alerts</p>
              <div className="mt-1 flex gap-2 text-sm">
                {outOfStock > 0 && <span className="text-red-600 dark:text-red-400 font-bold">{outOfStock} Out</span>}
                {lowStock > 0 && <span className="text-orange-600 dark:text-orange-400 font-bold">{lowStock} Low</span>}
                {outOfStock === 0 && lowStock === 0 && <span className="text-gray-400 dark:text-gray-500">All good</span>}
              </div>
            </div>
            <div className="p-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/products/add" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 dark:bg-primary/20 text-primary p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus size={18} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Add New Product</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-primary" />
            </Link>

            <a href={user?.darazStoreLink || "#"} target={user?.darazStoreLink ? "_blank" : "_self"} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-orange-50 dark:hover:bg-gray-700 transition-all group">
               <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ExternalLink size={18} />
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Visit Store</span>
              </div>
              <ArrowRight size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-primary" />
            </a>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Recently Added</h3>
            <Link to="/products" className="text-sm text-primary hover:underline">View All</Link>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">
              <p>No products yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 3).map(product => (
                <div key={product.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="h-10 w-10 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    <img src={product.images[0] || 'https://picsum.photos/100/100'} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Stock: {product.stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">Rs. {product.sellPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}