import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { StorageService } from '../services/storage';
import { Product } from '../types';
import { ArrowLeft, Save, Link as LinkIcon, Image as ImageIcon, Upload } from 'lucide-react';

interface ProductEditProps {
  mode: 'add' | 'edit';
}

export default function ProductEdit({ mode }: ProductEditProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(mode === 'edit');
  
  const [formData, setFormData] = useState({
    title: '',
    costPrice: '',
    sellPrice: '',
    stock: '',
    darazLink: '',
    image1: '',
    image2: '',
    image3: ''
  });

  useEffect(() => {
    if (mode === 'edit' && id) {
      StorageService.getProduct(id).then(product => {
        if (product) {
          setFormData({
            title: product.title,
            costPrice: product.costPrice.toString(),
            sellPrice: product.sellPrice.toString(),
            stock: product.stock.toString(),
            darazLink: product.darazLink || '',
            image1: product.images[0] || '',
            image2: product.images[1] || '',
            image3: product.images[2] || ''
          });
        }
        setFetching(false);
      });
    }
  }, [mode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const images = [formData.image1, formData.image2, formData.image3].filter(Boolean);

    try {
      const productData = {
        userId: user.id,
        title: formData.title,
        costPrice: Number(formData.costPrice),
        sellPrice: Number(formData.sellPrice),
        stock: Number(formData.stock),
        darazLink: formData.darazLink,
        images
      };

      if (mode === 'add') {
        await StorageService.addProduct(productData);
      } else if (id) {
        await StorageService.updateProduct(id, productData);
      }
      navigate('/products');
    } catch (error) {
      console.error(error);
      alert('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [fieldName]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (fetching) return <div className="p-10 text-center dark:text-white">Loading product details...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/products')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'add' ? 'Add New Product' : 'Edit Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 space-y-6 transition-colors">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Basic Info</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Title</label>
            <input
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Wireless Bluetooth Headphones"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cost Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">Rs.</span>
                <input
                  type="number"
                  name="costPrice"
                  required
                  min="0"
                  value={formData.costPrice}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Selling Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">Rs.</span>
                <input
                  type="number"
                  name="sellPrice"
                  required
                  min="0"
                  value={formData.sellPrice}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Qty</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Daraz Product Link</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                name="darazLink"
                type="url"
                value={formData.darazLink}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://www.daraz.pk/products/..."
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-700" />

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Images</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Paste URL or upload image (max 3).</p>
          
          {[1, 2, 3].map(num => (
            <div key={num} className="flex gap-2 sm:gap-4 items-center">
              <div className="flex-grow">
                 <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    // @ts-ignore
                    name={`image${num}`}
                    // @ts-ignore
                    value={formData[`image${num}`]}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={`Image URL ${num}`}
                  />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, `image${num}`)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload image"
                />
                <button type="button" className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-gray-600 dark:text-gray-300 transition-colors">
                  <Upload size={20} />
                </button>
              </div>

              {/* Preview */}
               {/* @ts-ignore */}
              {formData[`image${num}`] && (
                <div className="h-10 w-10 rounded border border-gray-200 dark:border-gray-600 overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                   {/* @ts-ignore */}
                  <img src={formData[`image${num}`]} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Calculations Preview */}
        {Number(formData.sellPrice) > 0 && Number(formData.costPrice) > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg flex justify-between items-center text-sm border border-blue-100 dark:border-blue-900/50">
            <span className="text-blue-700 dark:text-blue-300 font-medium">Est. Profit Per Unit:</span>
            <span className="font-bold text-blue-800 dark:text-blue-200">
              Rs. {Number(formData.sellPrice) - Number(formData.costPrice)}
            </span>
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}