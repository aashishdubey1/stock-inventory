import { useState, useEffect } from 'react';
import { Upload, ArrowRight, TrendingUp, TrendingDown, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import api from '../lib/api';

interface PageProps {
  onNavigate: (path: string) => void;
}

const recentTransactions = [
  { id: '1', type: 'IN' as const, item: 'PVC Cable 2.5mm', qty: 100, date: '2026-01-09 10:30' },
  { id: '2', type: 'OUT' as const, item: 'MCB 32A', qty: 25, date: '2026-01-09 09:15' },
  { id: '3', type: 'IN' as const, item: 'Copper Wire', qty: 200, date: '2026-01-09 08:45' },
];

export function StockInChargeDashboard({ onNavigate }: PageProps) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    stockInToday: 0,
    dispatchedToday: 0,
    lowStock: 0,
    totalItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cablesRes, looseRes] = await Promise.all([
          api.get('/cables'),
          api.get('/loose-lengths')
        ]);

        const cables = cablesRes.data.cableStocks;
        const loose = looseRes.data.looseLengths;
        const allItems = [...cables, ...loose];

        const lowStockCount = allItems.filter(item =>
          item.stockStatus?.toLowerCase() === 'low' || item.stockStatus?.toLowerCase() === 'depleted'
        ).length;

        setStats({
          // Mocking daily stats for now until transaction history API is ready
          stockInToday: 12,
          dispatchedToday: 8,
          lowStock: lowStockCount,
          totalItems: allItems.length
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Warehouse Dashboard</h1>
        <p className="text-gray-600">Overview of inventory and recent operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="lg" hover className="border-l-4 border-l-green-500 cursor-pointer transition-transform hover:-translate-y-1" onClick={() => handleNavigation('/stock-in')}>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-green-50 rounded-xl">
              <Upload className="text-green-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Stock In</h2>
              <p className="text-sm text-gray-600">Add Cable Drums or Loose Items</p>
            </div>
          </div>
        </Card>

        <Card padding="lg" hover className="border-l-4 border-l-blue-500 cursor-pointer transition-transform hover:-translate-y-1" onClick={() => handleNavigation('/dispatch')}>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-50 rounded-xl">
              <ArrowRight className="text-blue-600" size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Dispatch</h2>
              <p className="text-sm text-gray-600">Cut Cables, Multi-Coil, or Loose</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Items" value={stats.totalItems} icon={TrendingUp} color="blue" />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertTriangle} color="red" />
        {/* Mocked Stats for now */}
        <StatCard title="Stock In Today" value={stats.stockInToday} icon={Upload} color="green" />
        <StatCard title="Dispatched Today" value={stats.dispatchedToday} icon={ArrowRight} color="blue" />
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">MOCK DATA</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <Badge variant={transaction.type === 'IN' ? 'in' : 'out'} size="sm">
                      {transaction.type}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 font-medium text-gray-900">{transaction.item}</td>
                  <td className="py-4 px-4 text-gray-700 font-medium">{transaction.qty}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
