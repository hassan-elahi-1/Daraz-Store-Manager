import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { StorageService } from '../services/storage';
import { Product } from '../types';
import { Search, Plus, Edit2, Trash2, ExternalLink, Filter } from 'lucide-react';

export default function ProductList() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price' | 'stock'>('newest');

  useEffect(() => {
    if (user) {
      loadProducts();
    }
  }, [user]);

  const loadProducts = async () => {
    setLoading(true);
    if (user) {
      const data = await StorageService.getProducts(user.id);
      setProducts(data);
      setFilteredProducts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    // Immediate deletion without confirmation as requested
    await StorageService.deleteProduct(id);
    loadProducts();
  };

  useEffect(() => {
    let result = [...products];

    // Filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(lower));
    }

    // Sort
    if (sortBy === 'price') {
      result.sort((a, b) => b.sellPrice - a.sellPrice);
    } else if (sortBy === 'stock') {
      result.sort((a, b) => a.stock - b.stock);
    } else {
      // Newest (default from API but good to enforce)
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    setFilteredProducts(result);
  }, [searchTerm, sortBy, products]);

  if (loading) return <div className="p-10 text-center dark:text-white">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage your inventory ({products.length} items)</p>
        </div>
        <Link 
          to="/products/add" 
          className="inline-flex items-center gap-2 bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={18} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 transition-colors">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by product title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="newest">Newest First</option>
            <option value="price">Highest Price</option>
            <option value="stock">Lowest Stock</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 transition-colors">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Search size={48} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or add a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            const profit = product.sellPrice - product.costPrice;
            const margin = Math.round((profit / product.sellPrice) * 100);

            return (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group flex flex-col">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                  <img 
                    src={product.images[0] || 'https://picsum.photos/400/400'} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 h-12" title={product.title}>{product.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Cost</p>
                      <p className="font-medium text-gray-700 dark:text-gray-300">Rs. {product.costPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 dark:text-gray-400 text-xs">Sell</p>
                      <p className="font-bold text-primary">Rs. {product.sellPrice}</p>
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Stock: <span className={product.stock < 5 ? 'text-red-600 dark:text-red-400 font-bold' : 'text-gray-900 dark:text-white'}>{product.stock}</span></span>
                      <span className="text-green-600 dark:text-green-400 font-medium">+{margin}% Margin</span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <Link 
                        to={`/products/${product.id}/edit`} 
                        className="flex-1 flex items-center justify-center gap-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded text-sm font-medium transition-colors"
                      >
                        <Edit2 size={14} /> Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                      {product.darazLink && (
                        <a 
                          href={product.darazLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="View on Daraz"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}