import { useState } from 'react';
import { ArrowLeft, Search, CheckCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Page } from '../types';

interface NonCableStockInProps {
  onNavigate: (page: Page) => void;
}

const mockExistingItems = [
  { id: '1', name: 'MCB 32A', currentStock: 45 },
  { id: '2', name: 'Junction Box Large', currentStock: 230 },
  { id: '3', name: 'LED Bulb 9W', currentStock: 120 },
];

export function NonCableStockIn({ onNavigate }: NonCableStockInProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundItem, setFoundItem] = useState<any>(null);
  const [mode, setMode] = useState<'search' | 'update' | 'create'>('search');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [invoice, setInvoice] = useState('');
  const [godown, setGodown] = useState('Godown 1');
  const [itemName, setItemName] = useState('');

  const handleSearch = () => {
    const item = mockExistingItems.find(
      (i) => i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (item) {
      setFoundItem(item);
      setItemName(item.name);
      setMode('update');
    } else {
      setFoundItem(null);
      setItemName(searchQuery);
      setMode('create');
    }
  };

  const handleSubmit = () => {
    alert(`Stock ${mode === 'update' ? 'updated' : 'added'} successfully!`);
    onNavigate('stockincharge-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => onNavigate('stockincharge-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Non-Cable Stock In</h1>
          <p className="text-gray-600">Add or update non-cable inventory items</p>
        </div>

        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-bold text-gray-900 mb-4">Search for Item</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search by item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                />
              </div>
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {searchQuery && mode === 'search' && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Press Search to check if item exists in inventory
                </p>
              </div>
            )}
          </Card>

          {mode === 'update' && foundItem && (
            <>
              <Card padding="lg" className="bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
                  <div className="flex-1">
                    <h3 className="font-bold text-green-900 mb-2">Found Existing Item</h3>
                    <p className="text-green-800 mb-4">
                      This item already exists in your inventory
                    </p>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Item Name</p>
                        <p className="font-semibold text-gray-900">{foundItem.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Current Stock</p>
                        <p className="text-2xl font-bold text-blue-600">{foundItem.currentStock}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-4">
                <Button variant="primary" size="lg" fullWidth>
                  Update This Item
                </Button>
                <Button variant="secondary" size="lg" fullWidth onClick={() => setMode('create')}>
                  Create New Instead
                </Button>
              </div>
            </>
          )}

          {(mode === 'update' || mode === 'create') && (
            <Card padding="lg">
              <h3 className="font-bold text-gray-900 mb-6">
                {mode === 'update' ? 'Update Stock Details' : 'Create New Item'}
              </h3>
              <div className="space-y-6">
                {mode === 'create' && (
                  <Input
                    type="text"
                    placeholder="Enter item name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    label="Item Name"
                    required
                  />
                )}

                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  label={mode === 'update' ? 'Quantity to Add' : 'Initial Quantity'}
                  required
                />

                <Input
                  type="text"
                  placeholder="Enter supplier name"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  label="Supplier"
                  required
                />

                <Input
                  type="text"
                  placeholder="Enter invoice number"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                  label="Invoice Number"
                  required
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Godown Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={godown}
                    onChange={(e) => setGodown(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Godown 1">Godown 1</option>
                    <option value="Godown 2">Godown 2</option>
                  </select>
                </div>

                {mode === 'update' && foundItem && quantity && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">New Total Stock:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {foundItem.currentStock + parseInt(quantity)} units
                    </p>
                  </div>
                )}

                <Button variant="success" size="lg" fullWidth onClick={handleSubmit}>
                  {mode === 'update' ? 'Update Stock' : 'Add New Item'}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
