import { useState } from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Page } from '../types';

interface MultiCoilDispatchFormProps {
  onNavigate: (page: Page) => void;
}

export function MultiCoilDispatchForm({ onNavigate }: MultiCoilDispatchFormProps) {
  const [dispatchMode, setDispatchMode] = useState<'coils' | 'meters'>('coils');
  const [quantity, setQuantity] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const totalCoils = 6;
  const remainingCoils = 4;
  const metersPerCoil = 100;
  const calculatedMeters = dispatchMode === 'coils' ? parseInt(quantity || '0') * metersPerCoil : parseInt(quantity || '0');

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Multi-Coil Cable Dispatch</h1>
          <p className="text-gray-600">Drum: DRM-002 - PVC Cable 4mm Black</p>
        </div>

        <div className="space-y-6">
          <Card padding="lg" className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-900 mb-2">Multi-Coil Detected</h3>
                <p className="text-yellow-800">This drum contains multiple coils. Choose your dispatch method below.</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h3 className="font-bold text-gray-900 mb-4">Stock Visualization</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Coils Remaining</span>
                <span className="text-2xl font-bold text-blue-600">{remainingCoils} / {totalCoils}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${(remainingCoils / totalCoils) * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Each coil contains approximately {metersPerCoil} meters</p>
          </Card>

          <Card padding="lg">
            <h3 className="font-bold text-gray-900 mb-6">Dispatch Method</h3>

            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="dispatchMode"
                  value="coils"
                  checked={dispatchMode === 'coils'}
                  onChange={(e) => setDispatchMode(e.target.value as 'coils')}
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Dispatch by Coils</p>
                  <p className="text-sm text-gray-600">Enter the number of complete coils to dispatch</p>
                </div>
              </label>

              <label className="flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50">
                <input
                  type="radio"
                  name="dispatchMode"
                  value="meters"
                  checked={dispatchMode === 'meters'}
                  onChange={(e) => setDispatchMode(e.target.value as 'meters')}
                  className="mt-1 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Dispatch by Meters</p>
                  <p className="text-sm text-gray-600">Enter the exact length in meters to dispatch</p>
                </div>
              </label>
            </div>

            <div className="space-y-6">
              <Input
                type="number"
                placeholder={dispatchMode === 'coils' ? 'Enter number of coils' : 'Enter meters'}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                label={dispatchMode === 'coils' ? 'Number of Coils' : 'Length (meters)'}
                required
                error={
                  dispatchMode === 'coils' && quantity && parseInt(quantity) > remainingCoils
                    ? `Maximum ${remainingCoils} coils available`
                    : ''
                }
              />

              {quantity && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">This will dispatch:</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {dispatchMode === 'coils'
                      ? `${calculatedMeters} meters (${quantity} coils)`
                      : `${calculatedMeters} meters`}
                  </p>
                </div>
              )}

              <Input
                type="text"
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                label="Customer Name"
                required
              />

              <Input
                type="text"
                placeholder="Enter invoice number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                label="Invoice Number"
                required
              />

              <Button variant="primary" size="lg" fullWidth>
                Confirm Dispatch
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
