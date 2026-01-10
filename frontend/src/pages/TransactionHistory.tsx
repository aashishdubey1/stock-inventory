import { useState, useEffect } from 'react';
import { Download, Search, Filter, Loader2, Warehouse, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import api from '../lib/api';

interface Transaction {
  id: number;
  transactionType: 'IN' | 'OUT' | 'TRANSFER';
  quantity: number;
  unit: string;
  size: string;
  make: string;
  dispatchedCompany?: string;
  invoiceNumber?: string;
  createdAt: string;
  user: {
    username: string;
  };
  fromGodown?: {
    name: string;
  };
  toGodown?: {
    name: string;
  };
}

interface Godown {
  id: number;
  name: string;
}

export function TransactionHistory() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState('all');
  const [filterGodown, setFilterGodown] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [transactionsRes, godownsRes] = await Promise.all([
        api.get('/transactions?limit=100'), // Fetch a decent number for history
        api.get('/godowns')
      ]);
      setTransactions(transactionsRes.data.transactions || []);
      setGodowns(godownsRes.data.godowns || []);
    } catch (error) {
      console.error('Failed to fetch transaction history', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === 'all' || t.transactionType === filterType;
    const matchesGodown = filterGodown === 'all' ||
      (t.fromGodown?.name === filterGodown || t.toGodown?.name === filterGodown);
    const matchesSearch = searchTerm === '' ||
      t.size.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.dispatchedCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesGodown && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transaction Audit Logs</h1>
          <p className="text-gray-600">Traceable history of all stock movements and dispatches</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="secondary" icon={Download} onClick={() => window.print()}>
            Print Log
          </Button>
        </div>
      </div>

      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by size, make, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50/50"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-gray-50/50"
            >
              <option value="all">All Movements</option>
              <option value="IN">Stock In (IN)</option>
              <option value="OUT">Dispatch (OUT)</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div className="relative">
            <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={filterGodown}
              onChange={(e) => setFilterGodown(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-gray-50/50"
            >
              <option value="all">All Locations</option>
              {godowns.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={fetchData}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-600 font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
          >
            Refresh Data
          </button>
        </div>
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Entity/Invoice</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Godown</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Search size={48} className="text-gray-200 mb-4" />
                      <p className="text-lg font-medium">No transactions found</p>
                      <p className="text-sm">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant={t.transactionType === 'IN' ? 'in' : 'out'} size="sm">
                        {t.transactionType}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 leading-none mb-1">
                          {t.size}
                        </span>
                        <span className="text-xs text-gray-500 font-medium tracking-tight">
                          {t.make}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${t.transactionType === 'IN' ? 'text-green-600' : 'text-blue-600'}`}>
                          {t.transactionType === 'IN' ? '+' : '-'}{t.quantity}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{t.unit}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        {t.dispatchedCompany && (
                          <span className="text-sm font-medium text-gray-800">{t.dispatchedCompany}</span>
                        )}
                        {t.invoiceNumber && (
                          <span className="text-xs text-gray-500 font-bold">#{t.invoiceNumber}</span>
                        )}
                        {!t.dispatchedCompany && !t.invoiceNumber && (
                          <span className="text-xs text-gray-400 italic">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        {t.transactionType === 'IN' ? (
                          <>
                            <span className="p-1 bg-green-50 text-green-600 rounded">To</span>
                            <span>{t.toGodown?.name || 'Main'}</span>
                          </>
                        ) : (
                          <>
                            <span className="p-1 bg-blue-50 text-blue-600 rounded">From</span>
                            <span>{t.fromGodown?.name || 'Main'}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200 shadow-sm">
                          <span className="text-[10px] font-bold text-gray-600">
                            {t.user.username[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-700">{t.user.username}</span>
                      </div>
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
