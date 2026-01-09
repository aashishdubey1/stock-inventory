import { useState, useEffect } from 'react';
import { Search, Package, Server, Filter, RefreshCcw } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Input } from '../components/Input';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

interface StockItem {
  id: string; // drumNumber or id
  type: 'Cable' | 'Loose';
  description: string;
  quantity: number;
  location: string;
  godown: string;
  status: 'running' | 'low' | 'depleted';
  drumNumber?: string;
  make?: string;
}

export function SearcherDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cablesRes, looseRes] = await Promise.all([
        api.get('/cables'),
        api.get('/loose-lengths')
      ]);

      const cables = cablesRes.data.cableStocks.map((item: any) => ({
        id: item.drumNumber,
        type: 'Cable',
        description: `${item.size} ${item.conductorType} ${item.armourType} (${item.make})`,
        quantity: parseFloat(item.presentQuantity),
        location: item.location || 'N/A',
        godown: item.godown?.name || 'Unknown',
        status: item.stockStatus.toLowerCase(),
        drumNumber: item.drumNumber,
        make: item.make
      }));

      const loose = looseRes.data.looseLengths.map((item: any) => ({
        id: `L-${item.id}`,
        type: 'Loose',
        description: `${item.size} ${item.conductorType} (${item.quantity} ${item.unit})`,
        quantity: parseFloat(item.quantity),
        location: 'Loose Store',
        godown: item.godown?.name || 'Unknown',
        status: item.stockStatus.toLowerCase(),
        make: item.make
      }));

      setItems([...cables, ...loose]);
    } catch (error) {
      console.error('Failed to fetch stock data', error);
      toast.error('Failed to load inventory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      item.description.toLowerCase().includes(query) ||
      (item.drumNumber && item.drumNumber.toLowerCase().includes(query)) ||
      item.location.toLowerCase().includes(query) ||
      item.godown.toLowerCase().includes(query);

    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'Cable' || activeFilter === 'Loose') return matchesSearch && item.type === activeFilter;
    if (activeFilter.includes('Godown')) return matchesSearch && item.godown === activeFilter;

    return matchesSearch;
  });

  const getGodowns = () => Array.from(new Set(items.map(i => i.godown))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Search</h1>
          <p className="text-gray-500 text-sm">Real-time stock availability across all godowns</p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <Card padding="lg" className="border-none shadow-md bg-white">
        <div className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Search by drum number, cable size, type, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
            className="w-full"
          />

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-gray-500 text-sm mr-2">
              <Filter size={16} />
              <span>Filters:</span>
            </div>
            {['all', 'Cable', 'Loose', ...getGodowns()].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${activeFilter === filter
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
              >
                {filter === 'all' ? 'All Items' : filter}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} hover className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="">
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className={`p-2.5 rounded-lg flex-shrink-0 ${item.type === 'Cable' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                      {item.type === 'Cable' ? <Package size={20} /> : <Server size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate pr-1" title={item.description}>
                        {item.drumNumber || item.description.split(' ')[0]}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{item.type}</p>
                    </div>
                  </div>
                  <Badge variant={item.status} size="sm">
                    {item.status.toUpperCase()}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10" title={item.description}>
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Quantity</p>
                    <p className="text-lg font-bold text-gray-900">{item.quantity} m</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Location</p>
                    <p className="text-sm font-medium text-gray-700">{item.location}</p>
                    <p className="text-xs text-gray-500">{item.godown}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <Search className="mx-auto text-gray-300 mb-3" size={48} />
              <h3 className="text-lg font-medium text-gray-900">No items found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
