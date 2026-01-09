import { useState } from 'react';
import { ArrowLeft, FileText, Download, Printer, FileSpreadsheet } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Page } from '../types';

interface ReportsPageProps {
  onNavigate: (page: Page) => void;
}

const reportTypes = [
  { id: 'stock-summary', label: 'Stock Summary Report', description: 'Overview of all items in inventory' },
  { id: 'low-stock', label: 'Low Stock Report', description: 'Items below reorder level' },
  { id: 'transaction', label: 'Transaction Report', description: 'All stock movements in date range' },
  { id: 'customer', label: 'Customer Report', description: 'Orders by customer' },
  { id: 'supplier', label: 'Supplier Report', description: 'Purchases by supplier' },
  { id: 'valuation', label: 'Inventory Valuation', description: 'Total value of stock' },
];

export function ReportsPage({ onNavigate }: ReportsPageProps) {
  const [selectedReport, setSelectedReport] = useState('stock-summary');
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerated(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate and export inventory reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div>
            <Card padding="md">
              <h3 className="font-bold text-gray-900 mb-4">Report Type</h3>
              <div className="space-y-2">
                {reportTypes.map((report) => (
                  <label
                    key={report.id}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedReport === report.id
                        ? 'bg-blue-50 border-2 border-blue-600'
                        : 'border-2 border-transparent hover:bg-gray-50'
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
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{report.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card padding="lg">
              <h3 className="font-bold text-gray-900 mb-6">Report Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="2026-01-01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue="2026-01-09"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Godown
                  </label>
                  <select className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Godowns</option>
                    <option value="godown1">Godown 1</option>
                    <option value="godown2">Godown 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category
                  </label>
                  <select className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Categories</option>
                    <option value="cables">Cables</option>
                    <option value="non-cables">Non-Cables</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="primary" size="lg" fullWidth onClick={handleGenerateReport}>
                  Generate Report
                </Button>
              </div>
            </Card>

            {reportGenerated ? (
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <FileText className="text-blue-600" size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {reportTypes.find((r) => r.id === selectedReport)?.label}
                      </h3>
                      <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" icon={FileSpreadsheet} size="sm">
                      Excel
                    </Button>
                    <Button variant="secondary" icon={Download} size="sm">
                      PDF
                    </Button>
                    <Button variant="secondary" icon={Printer} size="sm">
                      Print
                    </Button>
                  </div>
                </div>

                <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {reportTypes.find((r) => r.id === selectedReport)?.label}
                    </h2>
                    <p className="text-gray-600">Period: January 1, 2026 - January 9, 2026</p>
                  </div>

                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Item Name</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Location</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { item: 'PVC Cable 2.5mm Red', category: 'Cables', stock: 450, location: 'A-12, Godown 1', status: 'In Stock' },
                        { item: 'Copper Wire 4mm', category: 'Cables', stock: 80, location: 'B-05, Godown 2', status: 'Low Stock' },
                        { item: 'MCB 32A', category: 'Non-Cables', stock: 0, location: 'C-22, Godown 1', status: 'Depleted' },
                        { item: 'Junction Box Large', category: 'Non-Cables', stock: 230, location: 'D-14, Godown 2', status: 'In Stock' },
                        { item: 'LED Bulb 9W', category: 'Non-Cables', stock: 120, location: 'E-03, Godown 1', status: 'In Stock' },
                      ].map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-3 px-4 text-gray-900">{row.item}</td>
                          <td className="py-3 px-4 text-gray-700">{row.category}</td>
                          <td className="py-3 px-4 font-semibold text-gray-900">{row.stock}</td>
                          <td className="py-3 px-4 text-gray-700">{row.location}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                row.status === 'In Stock'
                                  ? 'bg-green-100 text-green-800'
                                  : row.status === 'Low Stock'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Items</p>
                        <p className="text-2xl font-bold text-gray-900">5</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">In Stock</p>
                        <p className="text-2xl font-bold text-green-600">3</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Alerts</p>
                        <p className="text-2xl font-bold text-red-600">2</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card padding="lg">
                <div className="text-center py-16">
                  <FileText className="mx-auto text-gray-300 mb-4" size={64} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Report Generated</h3>
                  <p className="text-gray-600">Select filters and click "Generate Report" to view results</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
