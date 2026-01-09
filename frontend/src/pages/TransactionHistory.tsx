import { useState } from 'react';
import { ArrowLeft, Calendar, Download, Edit2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Page } from '../types';

interface TransactionHistoryProps {
  onNavigate: (page: Page) => void;
}

const transactions = [
  { id: '1', date: '2026-01-09 10:30', type: 'IN' as const, item: 'PVC Cable 2.5mm Red', qty: 100, customer: '-', invoice: 'INV-2345', location: 'Godown 1' },
  { id: '2', date: '2026-01-09 09:15', type: 'OUT' as const, item: 'MCB 32A', qty: 25, customer: 'ABC Electric', invoice: 'INV-2344', location: 'Godown 1' },
  { id: '3', date: '2026-01-09 08:45', type: 'IN' as const, item: 'Copper Wire 4mm', qty: 200, customer: '-', invoice: 'INV-2343', location: 'Godown 2' },
  { id: '4', date: '2026-01-08 16:20', type: 'OUT' as const, item: 'Junction Box Large', qty: 15, customer: 'XYZ Contractors', invoice: 'INV-2342', location: 'Godown 2' },
  { id: '5', date: '2026-01-08 14:10', type: 'IN' as const, item: 'LED Bulb 9W', qty: 150, customer: '-', invoice: 'INV-2341', location: 'Godown 1' },
  { id: '6', date: '2026-01-08 11:30', type: 'OUT' as const, item: 'PVC Cable 2.5mm Blue', qty: 50, customer: 'Building Supplies Co', invoice: 'INV-2340', location: 'Godown 1' },
  { id: '7', date: '2026-01-08 09:00', type: 'IN' as const, item: 'MCB 16A', qty: 80, customer: '-', invoice: 'INV-2339', location: 'Godown 2' },
  { id: '8', date: '2026-01-07 15:45', type: 'OUT' as const, item: 'Conduit Pipe 20mm', qty: 30, customer: 'City Electric', invoice: 'INV-2338', location: 'Godown 1' },
];

export function TransactionHistory({ onNavigate }: TransactionHistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');
  const [filterGodown, setFilterGodown] = useState('all');

  const itemsPerPage = 5;
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesGodown = filterGodown === 'all' || t.location === filterGodown;
    return matchesType && matchesGodown;
  });

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => onNavigate('supervisor-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p className="text-gray-600">View and manage all stock transactions</p>
        </div>

        <Card padding="lg" className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="date"
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="IN">Stock In</option>
                <option value="OUT">Dispatch</option>
              </select>
            </div>

            <div className="min-w-[150px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Godown
              </label>
              <select
                value={filterGodown}
                onChange={(e) => setFilterGodown(e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Godowns</option>
                <option value="Godown 1">Godown 1</option>
                <option value="Godown 2">Godown 2</option>
              </select>
            </div>

            <Button variant="primary" icon={Calendar}>
              Search
            </Button>

            <Button variant="secondary" icon={Download}>
              Export
            </Button>
          </div>
        </Card>

        <Card padding="lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Date & Time</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Item</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Quantity</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Invoice</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                  >
                    <td className="py-4 px-4 text-sm text-gray-900">{transaction.date}</td>
                    <td className="py-4 px-4">
                      <Badge variant={transaction.type === 'IN' ? 'in' : 'out'}>
                        {transaction.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">{transaction.item}</td>
                    <td className="py-4 px-4 text-gray-700">{transaction.qty}</td>
                    <td className="py-4 px-4 text-gray-700">{transaction.customer}</td>
                    <td className="py-4 px-4 text-gray-700">{transaction.invoice}</td>
                    <td className="py-4 px-4 text-gray-700">{transaction.location}</td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => onNavigate('edit-transaction')}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Edit transaction"
                      >
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of{' '}
              {filteredTransactions.length} transactions
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
