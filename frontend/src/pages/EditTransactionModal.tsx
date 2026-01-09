import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Page } from '../types';

interface EditTransactionModalProps {
  onNavigate: (page: Page) => void;
}

export function EditTransactionModal({ onNavigate }: EditTransactionModalProps) {
  const [quantity, setQuantity] = useState('100');
  const [customer, setCustomer] = useState('ABC Electric');
  const [invoice, setInvoice] = useState('INV-2345');
  const [reason, setReason] = useState('');

  const handleSave = () => {
    if (!reason.trim()) {
      alert('Please provide a reason for editing this transaction');
      return;
    }
    alert('Transaction updated successfully!');
    onNavigate('transaction-history');
  };

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Card padding="lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Transaction</h2>
            <button
              onClick={() => onNavigate('transaction-history')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Original Transaction</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="font-medium text-gray-900">2026-01-09 10:30</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Type</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    IN
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Item</p>
                  <p className="font-medium text-gray-900">PVC Cable 2.5mm Red</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Location</p>
                  <p className="font-medium text-gray-900">Godown 1</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Quantity</p>
                  <p className="font-medium text-gray-900">100 meters</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Customer</p>
                  <p className="font-medium text-gray-900">ABC Electric</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Invoice</p>
                  <p className="font-medium text-gray-900">INV-2345</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">User</p>
                  <p className="font-medium text-gray-900">John Doe</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Edit Fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  label="Quantity"
                />

                <Input
                  type="text"
                  placeholder="Enter customer name"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  label="Customer"
                />

                <Input
                  type="text"
                  placeholder="Enter invoice number"
                  value={invoice}
                  onChange={(e) => setInvoice(e.target.value)}
                  label="Invoice Number"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <select className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Godown 1</option>
                    <option>Godown 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reason for Edit <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this transaction needs to be edited..."
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none"
              />
              {!reason.trim() && (
                <p className="mt-2 text-sm text-red-600">This field is required</p>
              )}
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Warning</h4>
                <p className="text-sm text-yellow-800">
                  This will recalculate stock balances for this item. Make sure the changes are accurate.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => onNavigate('transaction-history')}
              >
                Cancel
              </Button>
              <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
