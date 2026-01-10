import { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, Printer, FileSpreadsheet, Loader2, Warehouse, Tag, Calendar, Filter, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import api from '../lib/api';

interface ReportRow {
  item: string;
  category: string;
  stock: string | number;
  location: string;
  status: string;
  extra?: string;
}

interface Godown {
  id: number;
  name: string;
}

const reportTypes = [
  { id: 'stock-summary', label: 'Stock Summary', description: 'Complete inventory status', icon: FileText, color: 'blue' },
  { id: 'low-stock', label: 'Low Stock', description: 'Items requiring attention', icon: BarChart3, color: 'red' },
  { id: 'transaction', label: 'Transactions', description: 'Audit of stock movements', icon: Calendar, color: 'indigo' },
];

export function ReportsPage() {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState('stock-summary');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [godowns, setGodowns] = useState<Godown[]>([]);
  const [reportData, setReportData] = useState<ReportRow[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '2026-01-01',
    endDate: new Date().toISOString().split('T')[0],
    godownId: 'all',
    category: 'all'
  });

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const res = await api.get('/godowns');
      setGodowns(res.data.godowns || []);
    } catch (error) {
      console.error('Failed to fetch godowns', error);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setReportGenerated(false);
    try {
      let data: ReportRow[] = [];

      if (selectedReport === 'stock-summary' || selectedReport === 'low-stock') {
        const [cablesRes, looseRes] = await Promise.all([
          api.get('/cables'),
          api.get('/loose-lengths')
        ]);

        const cables = cablesRes.data.cableStocks || [];
        const loose = looseRes.data.looseLengths || [];
        const allItems = [...cables, ...loose];

        const filteredItems = selectedReport === 'low-stock'
          ? allItems.filter(item => item.stockStatus?.toLowerCase() === 'low' || item.stockStatus?.toLowerCase() === 'depleted')
          : allItems;

        data = filteredItems.map(item => ({
          item: `${item.size} ${item.make || ''}`,
          category: item.drumNumber ? 'Cable Drum' : 'Loose length',
          stock: `${item.presentQuantity || item.quantity} m`,
          location: item.location || 'Main Storage',
          status: item.stockStatus || 'In Stock',
          extra: item.drumNumber || 'LOOSE'
        }));
      } else if (selectedReport === 'transaction') {
        const res = await api.get('/transactions?limit=100');
        const transactions = res.data.transactions || [];

        data = transactions.map((t: any) => ({
          item: `${t.size} ${t.make}`,
          category: t.transactionType,
          stock: `${t.quantity} ${t.unit}`,
          location: t.fromGodown?.name || t.toGodown?.name || 'Main',
          status: new Date(t.createdAt).toLocaleDateString(),
          extra: t.invoiceNumber || 'N/A'
        }));
      }

      setReportData(data);
      setReportGenerated(true);
    } catch (error) {
      console.error('Failed to generate report', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600">Extract insights and audit trails from your inventory data</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-6">
          <Card padding="md" className="border-t-4 border-t-blue-600">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Filter size={18} className="text-blue-600" />
              Report Type
            </h3>
            <div className="space-y-3">
              {reportTypes.map((report) => (
                <label
                  key={report.id}
                  className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedReport === report.id
                    ? `bg-${report.color}-50 border-${report.color}-600`
                    : 'bg-white border-gray-100 hover:border-gray-300'
                    }`}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={report.id}
                    checked={selectedReport === report.id}
                    onChange={(e) => {
                      setSelectedReport(e.target.value);
                      setReportGenerated(false);
                    }}
                    className="mt-1 sr-only"
                  />
                  <div className={`p-2 rounded-lg bg-${report.color === 'blue' ? 'blue' : report.color === 'red' ? 'red' : 'indigo'}-100`}>
                    <report.icon size={20} className={`text-${report.color === 'blue' ? 'blue' : report.color === 'red' ? 'red' : 'indigo'}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${selectedReport === report.id ? 'text-gray-900' : 'text-gray-700'}`}>
                      {report.label}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                      {report.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          <Card padding="md">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Settings2 size={18} className="text-gray-500" />
              Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Location</label>
                <div className="relative">
                  <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={filters.godownId}
                    onChange={(e) => setFilters({ ...filters, godownId: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Godowns</option>
                    {godowns.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="all">All Items</option>
                    <option value="cables">Cable Drums</option>
                    <option value="loose">Loose Lengths</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleGenerateReport}
                // disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    'Run Report'
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {reportGenerated ? (
            <Card padding="none" className="overflow-hidden">
              <div className="bg-white p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-2xl">
                    <FileText className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {reportTypes.find(r => r.id === selectedReport)?.label} Result
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      Executed on {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" icon={Printer} onClick={() => window.print()}>Print</Button>
                  <Button variant="secondary" size="sm" icon={FileSpreadsheet}>CSV</Button>
                  <Button variant="primary" size="sm" icon={Download}>PDF</Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Item Description</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Identifier</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Stock Level</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Location</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-20 text-center">
                          <BarChart3 className="mx-auto text-gray-200 mb-4" size={64} />
                          <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">No records found for the selection</p>
                        </td>
                      </tr>
                    ) : (
                      reportData.map((row, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-4 px-6">
                            <span className="text-sm font-bold text-gray-900">{row.item}</span>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{row.category}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {row.extra}
                            </span>
                          </td>
                          <td className="py-4 px-6 font-bold text-sm text-gray-900">{row.stock}</td>
                          <td className="py-4 px-6 text-sm text-gray-600 font-medium">{row.location}</td>
                          <td className="py-4 px-6">
                            <Badge
                              variant={
                                row.status.toLowerCase() === 'in stock' || selectedReport === 'transaction'
                                  ? 'in'
                                  : row.status.toLowerCase() === 'low'
                                    ? 'out' // We'll use out color for low
                                    : 'out' // default out
                              }
                              size="sm"
                            >
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-50 p-6 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Entries</p>
                    <p className="text-xl font-black text-gray-900">{reportData.length}</p>
                  </div>
                  {selectedReport !== 'transaction' && (
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Alert items</p>
                      <p className="text-xl font-black text-red-600">
                        {reportData.filter(r => r.status.toLowerCase() !== 'in stock').length}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-bold italic tracking-tight">** Confidential Internal Document **</p>
              </div>
            </Card>
          ) : (
            <Card padding="none" className="bg-white border-2 border-dashed border-gray-200">
              <div className="text-center py-32 px-10">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileSpreadsheet className="text-gray-300" size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Ready to Generate</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
                  Select a report type from the sidebar, configure your godown and category filters, then click "Run Report" to generate results.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
                  <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                  <div className="h-1 w-2 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

const Settings2 = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
);
