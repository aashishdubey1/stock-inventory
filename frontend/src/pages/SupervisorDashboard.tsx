import { Package, AlertTriangle, TrendingUp, DollarSign, Database, FileText, Edit, Users, Warehouse, Settings, Activity } from 'lucide-react';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Page } from '../types';

interface SupervisorDashboardProps {
  onNavigate: (page: Page) => void;
}

const activities = [
  { user: 'John Doe', action: 'Added 100m PVC Cable 2.5mm', time: '5 mins ago', avatar: 'JD' },
  { user: 'Jane Smith', action: 'Dispatched 25 MCB 32A', time: '12 mins ago', avatar: 'JS' },
  { user: 'Mike Wilson', action: 'Updated Junction Box stock', time: '23 mins ago', avatar: 'MW' },
  { user: 'Sarah Lee', action: 'Added new supplier: ABC Electric', time: '45 mins ago', avatar: 'SL' },
  { user: 'Tom Brown', action: 'Dispatched 200m Copper Wire', time: '1 hour ago', avatar: 'TB' },
];

const alerts = [
  { id: '1', message: 'MCB 32A stock depleted', severity: 'critical' as const },
  { id: '2', message: 'Low stock alert: LED Bulb 9W', severity: 'warning' as const },
  { id: '3', message: '3 pending stock verifications', severity: 'info' as const },
];

export function SupervisorDashboard({ onNavigate }: SupervisorDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
                <p className="text-sm text-gray-600">Complete system overview and management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@company.com</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Items" value="1,247" icon={Package} color="blue" />
          <StatCard title="Low Stock Alerts" value="8" icon={AlertTriangle} color="yellow" />
          <StatCard title="Today's Transactions" value="34" icon={TrendingUp} color="green" />
          <StatCard title="Total Value" value="₹24.5L" icon={DollarSign} color="blue" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: 'Manage Stock', icon: Database, color: 'blue' },
                { label: 'View Reports', icon: FileText, color: 'green', onClick: () => onNavigate('reports') },
                { label: 'Edit Data', icon: Edit, color: 'yellow' },
                { label: 'Manage Users', icon: Users, color: 'purple' },
                { label: 'Manage Godowns', icon: Warehouse, color: 'red' },
                { label: 'Settings', icon: Settings, color: 'gray' },
              ].map((action) => (
                <Card key={action.label} hover padding="md">
                  <button
                    onClick={action.onClick}
                    className="w-full text-left"
                  >
                    <div className={`p-4 bg-${action.color}-50 rounded-xl mb-3 inline-flex`}>
                      <action.icon className={`text-${action.color}-600`} size={28} />
                    </div>
                    <p className="font-semibold text-gray-900">{action.label}</p>
                  </button>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Alerts</h2>
            <Card padding="md">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border border-red-200'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        alert.severity === 'critical'
                          ? 'text-red-800'
                          : alert.severity === 'warning'
                          ? 'text-yellow-800'
                          : 'text-blue-800'
                      }`}
                    >
                      {alert.message}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <Card padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="text-gray-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{activity.avatar}</span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">
                    <span className="font-semibold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
