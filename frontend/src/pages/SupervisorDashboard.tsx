import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign, Database, FileText, Edit, Users, Warehouse, Settings, Activity, Loader2, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import api from '../lib/api';
import { Page } from '../types';

interface SupervisorDashboardProps {
  onNavigate?: (page: Page) => void;
}

interface Transaction {
  id: number;
  transactionType: 'IN' | 'OUT' | 'TRANSFER';
  quantity: number;
  unit: string;
  size: string;
  make: string;
  dispatchedCompany?: string;
  createdAt: string;
  user: {
    username: string;
  };
}

interface LowStockItem {
  id: number;
  drumNumber: string;
  make: string;
  size: string;
  presentQuantity: number;
  stockStatus: string;
}

export function SupervisorDashboard({ onNavigate }: SupervisorDashboardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    todayTransactions: 0,
    totalGodowns: 0,
    totalCableValue: 0 // Mocked for now as we don't have prices
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [cablesRes, looseRes, transactionsRes, godownsRes] = await Promise.all([
        api.get('/cables'),
        api.get('/loose-lengths'),
        api.get('/transactions?limit=10'),
        api.get('/godowns')
      ]);

      const cables = cablesRes.data.cableStocks || [];
      const loose = looseRes.data.looseLengths || [];
      const allItems = [...cables, ...loose];
      const godowns = godownsRes.data.godowns || [];

      const lowStockItems = allItems.filter(item =>
        item.stockStatus?.toLowerCase() === 'low' || item.stockStatus?.toLowerCase() === 'depleted'
      );

      const transactionsList = transactionsRes.data.transactions || [];

      const today = new Date().toDateString();
      const todayTransactionsCount = transactionsList.filter((t: any) =>
        new Date(t.createdAt).toDateString() === today
      ).length;

      setStats({
        totalItems: allItems.length,
        lowStock: lowStockItems.length,
        todayTransactions: todayTransactionsCount,
        totalGodowns: godowns.length,
        totalCableValue: 24.5 // Keep a placeholder for value
      });

      setTransactions(transactionsList);
      setLowStockAlerts(lowStockItems.slice(0, 3)); // Show top 3 alerts
    } catch (error) {
      console.error('Failed to fetch supervisor dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supervisor Dashboard</h1>
          <p className="text-gray-600">Complete system overview and management</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-900">{user?.username || 'Supervisor'}</p>
            <p className="text-xs text-blue-600 font-medium">{user?.role}</p>
          </div>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-100">
            <span className="text-white font-bold">{user?.username?.[0].toUpperCase() || 'S'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Inventory" value={stats.totalItems.toLocaleString()} icon={Package} color="blue" />
        <StatCard title="Low Stock Alerts" value={stats.lowStock} icon={AlertTriangle} color="red" />
        <StatCard title="Today's Trans." value={stats.todayTransactions} icon={TrendingUp} color="green" />
        <StatCard title="Total Warehouses" value={stats.totalGodowns} icon={Warehouse} color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} className="text-blue-600" />
            Quick Management
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Inventory', icon: Database, color: 'blue', path: '/search', desc: 'View all stock' },
              { label: 'Reports', icon: FileText, color: 'green', path: '/reports', desc: 'System insights' },
              { label: 'History', icon: Clock, color: 'indigo', path: '/history', desc: 'All transactions' },
              { label: 'Users', icon: Users, color: 'purple', path: '/users', desc: 'Staff control' },
              { label: 'Godowns', icon: Warehouse, color: 'orange', path: '/godowns', desc: 'Location mgmt' },
              { label: 'Settings', icon: Settings, color: 'gray', path: '/settings', desc: 'App config' },
            ].map((action) => (
              <Card key={action.label} hover padding="md" className="cursor-pointer group" onClick={() => handleAction(action.path)}>
                <div className="flex flex-col h-full">
                  <div className={`p-3 rounded-xl mb-3 inline-flex self-start transition-colors bg-${action.color}-50 group-hover:bg-${action.color}-100`}>
                    <action.icon className={`text-${action.color}-600`} size={24} />
                  </div>
                  <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{action.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            Critical Alerts
          </h2>
          <div className="space-y-4">
            {lowStockAlerts.length > 0 ? (
              lowStockAlerts.map((alert) => (
                <Card key={alert.id} padding="md" className="border-l-4 border-l-red-500">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-gray-900">{alert.drumNumber || 'Loose Item'}</p>
                    <Badge variant="out" size="sm">{alert.stockStatus}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alert.make} - {alert.size}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">Qty Remaining</span>
                    <span className="text-sm font-bold text-red-600">{alert.presentQuantity}m</span>
                  </div>
                </Card>
              ))
            ) : (
              <Card padding="md" className="text-center py-8">
                <Package className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-sm text-gray-500">All stock levels healthy</p>
              </Card>
            )}
            <button
              onClick={() => handleAction('/search')}
              className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-100"
            >
              View All Inventory
            </button>
          </div>
        </div>
      </div>

      <Card padding="lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">System Activity</h2>
          </div>
          <button
            onClick={() => handleAction('/history')}
            className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            View History <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Activity className="mx-auto text-gray-200 mb-2" size={40} />
                    <p>No recent activity logs</p>
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-600">
                            {transaction.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{transaction.user.username}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={transaction.transactionType === 'IN' ? 'in' : 'out'} size="sm">
                        {transaction.transactionType === 'IN' ? 'Added' : 'Dispatched'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">{transaction.size}</p>
                      <p className="text-xs text-gray-500">{transaction.make}</p>
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-700 text-sm">
                      {transaction.quantity} {transaction.unit}
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-xs font-medium">
                      {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
// End of file
