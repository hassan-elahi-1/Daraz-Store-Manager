import React, { useEffect, useState } from 'react';
import { useAuth } from '../App';
import { StorageService } from '../services/storage';
import { GeminiService } from '../services/gemini';
import { Product } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) {
      StorageService.getProducts(user.id).then(data => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [user]);

  // Calculations
  const totalCost = products.reduce((acc, p) => acc + (p.costPrice * p.stock), 0);
  const totalProjectedRevenue = products.reduce((acc, p) => acc + (p.sellPrice * p.stock), 0);
  const totalProjectedProfit = totalProjectedRevenue - totalCost;

  // Chart Data Preparation (Grouping by Month Added)
  const chartData = products.reduce((acc: any[], product) => {
    const date = new Date(product.createdAt);
    const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    
    const existing = acc.find(item => item.name === monthKey);
    const profit = (product.sellPrice - product.costPrice) * product.stock;
    const cost = product.costPrice * product.stock;

    if (existing) {
      existing.Cost += cost;
      existing.Profit += profit;
    } else {
      acc.push({ name: monthKey, Cost: cost, Profit: profit });
    }
    return acc;
  }, []);

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    const result = await GeminiService.analyzeBusiness(products);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  if (loading) return <div className="p-10 text-center">Loading reports...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-sm text-gray-500">Overview of your inventory value and projected profits.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Inventory Cost</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">Rs. {totalCost.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 mt-1">Value of unsold stock</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Projected Revenue</p>
          <h3 className="text-2xl font-bold text-blue-600 mt-2">Rs. {totalProjectedRevenue.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 mt-1">If all stock sells</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Projected Profit</p>
          <h3 className="text-2xl font-bold text-emerald-600 mt-2">Rs. {totalProjectedProfit.toLocaleString()}</h3>
          <p className="text-xs text-gray-400 mt-1">Net profit after costs</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-lg text-gray-900 mb-6">Inventory Value by Month Added</h3>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Not enough data to display chart.
            </div>
          )}
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <BrainCircuit className="text-yellow-400" size={28} />
          <h2 className="text-xl font-bold">AI Business Insights</h2>
        </div>
        
        {!aiAnalysis ? (
          <div className="space-y-4">
            <p className="text-indigo-200">
              Get an instant analysis of your inventory health, margin risks, and profit opportunities powered by Google Gemini AI.
            </p>
            <button 
              onClick={handleAiAnalysis}
              disabled={analyzing || products.length === 0}
              className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="animate-spin" size={20} /> : null}
              {analyzing ? 'Analyzing...' : 'Generate Analysis'}
            </button>
            {products.length === 0 && <p className="text-xs text-red-300">Add products to use AI analysis.</p>}
          </div>
        ) : (
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
             <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-line">
              {aiAnalysis}
             </div>
             <button 
              onClick={() => setAiAnalysis('')}
              className="mt-4 text-indigo-300 hover:text-white text-sm underline"
             >
               Clear Analysis
             </button>
          </div>
        )}
      </div>
    </div>
  );
}