import { useState } from 'react';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { CableDetailsCard } from '../components/CableDetailsCard';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Search, Loader2, Scissors, AlertCircle } from 'lucide-react';
import { Page } from '../types';

interface CableDispatchFormProps {
  onNavigate: (page: Page) => void;
}

interface CableStock {
  id: number;
  drumNumber: string;
  size: string;
  conductorType: string;
  armourType: string;
  frls: string;
  make: string;
  presentQuantity: number;
  initialQuantity: number;
  details: string;
  site: string;
  location?: string;
  isMultiCoil?: boolean;
  coilsRemaining?: number;
  totalCoils?: number;
  qtyPerCoil?: number;
}

export function CableDispatchForm({ onNavigate }: CableDispatchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedCable, setSelectedCable] = useState<CableStock | null>(null);
  const [loading, setLoading] = useState(false);

  const [dispatchData, setDispatchData] = useState({
    quantity: '',
    dispatchedCompany: '',
    invoiceNumber: '',
    invoiceDate: '',
    coilsDispatched: '',
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a drum number');
      return;
    }

    setSearching(true);
    try {
      const response = await api.get(`/cables?drumNumber=${searchQuery}`);
      const cables = response.data.cableStocks;

      if (cables && cables.length > 0) {
        setSelectedCable(cables[0]);
        toast.success('Cable drum found!');
      } else {
        toast.error('No cable drum found with this number');
        setSelectedCable(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to search cable');
      setSelectedCable(null);
    } finally {
      setSearching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For multi-coil drums, ONLY allow full coil dispatch
    if (selectedCable?.isMultiCoil && selectedCable.qtyPerCoil) {
      if (name === 'coilsDispatched') {
        // User entered coils, calculate meters automatically
        const coils = parseInt(value) || 0;
        const meters = coils * selectedCable.qtyPerCoil;
        setDispatchData(prev => ({
          ...prev,
          coilsDispatched: value,
          quantity: meters > 0 ? meters.toFixed(2) : ''
        }));
        return;
      }
      // For multi-coil, ignore direct quantity changes (read-only)
      if (name === 'quantity') {
        return;
      }
    }

    setDispatchData(prev => ({ ...prev, [name]: value }));
  };

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCable) {
      toast.error('Please select a cable drum first');
      return;
    }

    const quantity = parseFloat(dispatchData.quantity);
    if (quantity > selectedCable.presentQuantity) {
      toast.error(`Cannot dispatch more than available quantity (${selectedCable.presentQuantity}m)`);
      return;
    }

    // Multi-coil validation: MUST dispatch full coils only
    if (selectedCable.isMultiCoil) {
      const coilsDispatched = parseInt(dispatchData.coilsDispatched);

      if (!coilsDispatched || coilsDispatched <= 0) {
        toast.error('Please enter number of coils to dispatch');
        return;
      }

      if (coilsDispatched > (selectedCable.coilsRemaining || 0)) {
        toast.error(`Cannot dispatch more than ${selectedCable.coilsRemaining} remaining coils`);
        return;
      }

      // Validate that quantity matches coils × meters/coil
      const expectedMeters = coilsDispatched * (selectedCable.qtyPerCoil || 0);
      if (Math.abs(quantity - expectedMeters) > 0.01) {
        toast.error(`For multi-coil drums, you must dispatch full coils. ${coilsDispatched} coils = ${expectedMeters}m`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        cableStockId: selectedCable.id,
        quantity,
        dispatchedCompany: dispatchData.dispatchedCompany,
        invoiceNumber: dispatchData.invoiceNumber,
      };

      if (dispatchData.invoiceDate) {
        payload.invoiceDate = dispatchData.invoiceDate;
      }

      // For multi-coil drums, always send coilsDispatched
      if (selectedCable.isMultiCoil && dispatchData.coilsDispatched) {
        payload.coilsDispatched = parseInt(dispatchData.coilsDispatched);
      }

      await api.post('/transactions/out', payload);
      toast.success('Cable dispatched successfully!');

      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to dispatch cable');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCable(null);
    setSearchQuery('');
    setDispatchData({
      quantity: '',
      dispatchedCompany: '',
      invoiceNumber: '',
      invoiceDate: '',
      coilsDispatched: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 sm:pt-8 px-4 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Cable Dispatch</h1>
        <p className="text-sm sm:text-base text-gray-600">Cut and dispatch cable from drums</p>
      </div>

      {/* Search Section */}
      <Card padding="md" className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Search className="text-blue-600 flex-shrink-0" size={20} />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Search Cable Drum</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter drum number..."
            className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {searching ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </Card>

      {/* Cable Details */}
      {selectedCable && (
        <Card padding="md" className="mb-4 sm:mb-6 border-l-4 border-l-green-500">
          <CableDetailsCard cable={selectedCable} />

          {selectedCable.presentQuantity === 0 && (
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200 mt-4">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700 font-medium">
                This drum is depleted and cannot be dispatched
              </p>
            </div>
          )}

          {/* Multi-coil info banner */}
          {selectedCable.isMultiCoil && selectedCable.presentQuantity > 0 && (
            <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200 mt-4">
              <AlertCircle className="text-indigo-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-indigo-700">
                <p className="font-semibold">Multi-Coil Drum</p>
                <p>You can only dispatch full coils. Enter number of coils, meters will be calculated automatically.</p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Dispatch Form */}
      {selectedCable && selectedCable.presentQuantity > 0 && (
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <Scissors className="text-blue-600 flex-shrink-0" size={20} />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Dispatch Details</h2>
          </div>

          <form onSubmit={handleDispatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* For multi-coil: Show coils first, then auto-calculated meters */}
              {selectedCable.isMultiCoil ? (
                <>
                  <FormInput
                    label="Number of Coils"
                    type="number"
                    name="coilsDispatched"
                    value={dispatchData.coilsDispatched}
                    onChange={handleChange}
                    required
                    min="1"
                    max={selectedCable.coilsRemaining}
                    placeholder={`Max: ${selectedCable.coilsRemaining} coils`}
                  />
                  <FormInput
                    label="Quantity (Auto-calculated)"
                    type="number"
                    name="quantity"
                    value={dispatchData.quantity}
                    onChange={handleChange}
                    required
                    disabled
                    step="0.01"
                    placeholder="Calculated from coils"
                  />
                </>
              ) : (
                <FormInput
                  label="Quantity to Dispatch (m)"
                  type="number"
                  name="quantity"
                  value={dispatchData.quantity}
                  onChange={handleChange}
                  required
                  min="0.01"
                  max={selectedCable.presentQuantity}
                  step="0.01"
                  placeholder={`Max: ${selectedCable.presentQuantity}m`}
                />
              )}

              <FormInput
                label="Dispatched Company"
                type="text"
                name="dispatchedCompany"
                value={dispatchData.dispatchedCompany}
                onChange={handleChange}
                required
                placeholder="Company name"
              />

              <FormInput
                label="Invoice Number"
                type="text"
                name="invoiceNumber"
                value={dispatchData.invoiceNumber}
                onChange={handleChange}
                required
                placeholder="INV-001"
              />

              <FormInput
                label="Invoice Date"
                type="date"
                name="invoiceDate"
                value={dispatchData.invoiceDate}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Scissors size={20} />
                    <span>Dispatch Cable</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Empty State */}
      {!selectedCable && !searching && (
        <Card padding="md" className="text-center">
          <div className="py-8 sm:py-12">
            <Search className="mx-auto text-gray-400 mb-3 sm:mb-4" size={40} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
              No Cable Selected
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Search for a cable drum to begin dispatching
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
