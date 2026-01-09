import { useState } from 'react';
import { ArrowLeft, Package, MapPin } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Badge } from '../components/Badge';
import { Page } from '../types';

interface CableDispatchFormProps {
  onNavigate: (page: Page) => void;
}

export function CableDispatchForm({ onNavigate }: CableDispatchFormProps) {
  const [step, setStep] = useState(1);
  const [drumNumber, setDrumNumber] = useState('');
  const [cableDetails, setCableDetails] = useState<any>(null);
  const [dispatchQty, setDispatchQty] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');

  const handleFetch = () => {
    setCableDetails({
      drumNumber: drumNumber,
      cableType: 'PVC Insulated Cable 2.5mm',
      make: 'Polycab',
      availableQty: 450,
      location: 'A-12',
      godown: 'Godown 1',
    });
    setStep(2);
  };

  const handleDispatch = () => {
    alert('Dispatch successful!');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cable Dispatch</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="font-medium">Enter Drum</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 rounded">
              <div className={`h-full rounded transition-all ${step >= 2 ? 'bg-blue-600 w-full' : 'w-0'}`}></div>
            </div>
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="font-medium">Dispatch Details</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Step 1: Enter Drum Number</h2>
            <div className="space-y-6">
              <Input
                type="text"
                placeholder="Enter drum number (e.g., DRM-001)"
                value={drumNumber}
                onChange={(e) => setDrumNumber(e.target.value)}
                label="Drum Number"
                required
              />
              <Button variant="primary" size="lg" fullWidth onClick={handleFetch}>
                Fetch Cable Details
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && cableDetails && (
          <div className="space-y-6">
            <Card padding="lg" className="bg-blue-50 border-blue-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <Package className="text-white" size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">Cable Details</h2>
                    <Badge variant="running">Available</Badge>
                  </div>
                  <p className="text-gray-600">Drum: {cableDetails.drumNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cable Type</p>
                  <p className="font-semibold text-gray-900">{cableDetails.cableType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Make</p>
                  <p className="font-semibold text-gray-900">{cableDetails.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Quantity</p>
                  <p className="text-3xl font-bold text-green-600">{cableDetails.availableQty}m</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-600" />
                    <p className="font-semibold text-gray-900">{cableDetails.location}, {cableDetails.godown}</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Step 2: Dispatch Information</h2>
              <div className="space-y-6">
                <Input
                  type="number"
                  placeholder="Enter quantity in meters"
                  value={dispatchQty}
                  onChange={(e) => setDispatchQty(e.target.value)}
                  label="Dispatch Quantity (meters)"
                  required
                  error={dispatchQty && parseInt(dispatchQty) > cableDetails.availableQty ? `Maximum available: ${cableDetails.availableQty}m` : ''}
                />

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

                <div className="flex gap-4">
                  <Button variant="secondary" size="lg" fullWidth onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleDispatch}
                  >
                    Confirm Dispatch
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
