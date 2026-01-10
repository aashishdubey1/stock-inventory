import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { FormSelect } from '../components/FormSelect';
import { FormTextarea } from '../components/FormTextarea';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Package, Loader2 } from 'lucide-react';
import { Page } from '../types';

interface Godown {
    id: number;
    name: string;
}

interface CableStockInProps {
    onNavigate: (page: Page) => void;
}

export function CableStockIn({ onNavigate }: CableStockInProps) {
    const [godowns, setGodowns] = useState<Godown[]>([]);
    const [loading, setLoading] = useState(false);
    const [isMultiCoil, setIsMultiCoil] = useState(false);

    const [formData, setFormData] = useState({
        drumNumber: '',
        size: '',
        conductorType: 'CU' as 'CU' | 'AL',
        armourType: 'UNARM' as 'ARM' | 'FLEX' | 'UNARM',
        frls: 'FRLS',
        details: '',
        make: '',
        partNo: '',
        initialQuantity: '',
        presentQuantity: '',
        godownId: '',
        site: '',
        location: '',
        numberOfCartons: '',
        coilsPerCarton: '',
        qtyPerCoil: '',
    });

    useEffect(() => {
        fetchGodowns();
    }, []);

    const fetchGodowns = async () => {
        try {
            const response = await api.get('/godowns');
            setGodowns(response.data.godowns || []);
        } catch (error) {
            toast.error('Failed to fetch godowns');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                drumNumber: formData.drumNumber,
                size: formData.size,
                conductorType: formData.conductorType,
                armourType: formData.armourType,
                frls: formData.frls,
                details: formData.details,
                make: formData.make,
                partNo: formData.partNo || undefined,
                initialQuantity: parseFloat(formData.initialQuantity),
                // presentQuantity: parseFloat(formData.presentQuantity),
                godownId: parseInt(formData.godownId),
                site: formData.site,
                location: formData.location || undefined,
                packagingType: isMultiCoil ? 'MULTI_COIL' : 'DRUM',
            };

            if (isMultiCoil) {
                const numberOfCartons = parseInt(formData.numberOfCartons);
                const coilsPerCarton = parseInt(formData.coilsPerCarton);
                const qtyPerCoil = parseFloat(formData.qtyPerCoil);

                payload.isMultiCoil = true;
                payload.numberOfCartons = numberOfCartons;
                payload.coilsPerCarton = coilsPerCarton;
                payload.totalCoils = numberOfCartons * coilsPerCarton;
                payload.coilsRemaining = numberOfCartons * coilsPerCarton;
                payload.qtyPerCoil = qtyPerCoil;
            }

            await api.post('/cables', payload);
            toast.success('Cable stock added successfully!');

            // Reset form
            setFormData({
                drumNumber: '',
                size: '',
                conductorType: 'CU',
                armourType: 'UNARM',
                frls: 'FRLS',
                details: '',
                make: '',
                partNo: '',
                initialQuantity: '',
                presentQuantity: '',
                godownId: '',
                site: '',
                location: '',
                numberOfCartons: '',
                coilsPerCarton: '',
                qtyPerCoil: '',
            });
            setIsMultiCoil(false);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add cable stock');
        } finally {
            setLoading(false);
        }
    };

    const godownOptions = [
        { value: '', label: 'Select Godown' },
        ...godowns.map(g => ({ value: g.id, label: g.name }))
    ];

    const totalCoils = formData.numberOfCartons && formData.coilsPerCarton
        ? parseInt(formData.numberOfCartons) * parseInt(formData.coilsPerCarton)
        : 0;

    return (
        <div className="max-w-4xl mx-auto pt-4 sm:pt-8 px-4 sm:px-0">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Add Cable Stock</h1>
                <p className="text-sm sm:text-base text-gray-600">Register a new cable drum in the inventory</p>
            </div>

            <Card padding="md">
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Packaging Type Toggle */}
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                        <Package className="text-blue-600 flex-shrink-0" size={20} />
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isMultiCoil}
                                onChange={(e) => setIsMultiCoil(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-900">Multi-Coil Packaging</span>
                        </label>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormInput
                            label="Drum Number"
                            type="text"
                            name="drumNumber"
                            value={formData.drumNumber}
                            onChange={handleChange}
                            required
                            placeholder="e.g., DRUM-001"
                        />


                        <FormInput
                            label="Cable Size"
                            type="text"
                            name="size"
                            value={formData.size}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 6 * 4 core"
                        />

                        <FormSelect
                            label="Conductor Type"
                            name="conductorType"
                            value={formData.conductorType}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'CU', label: 'Copper (CU)' },
                                { value: 'AL', label: 'Aluminum (AL)' }
                            ]}
                        />

                        <FormSelect
                            label="Armour Type"
                            name="armourType"
                            value={formData.armourType}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'UNARM', label: 'Unarmoured' },
                                { value: 'ARM', label: 'Armoured' },
                                { value: 'FLEX', label: 'Flexible' }
                            ]}
                        />

                        <FormSelect
                            label="FRLS"
                            name="frls"
                            value={formData.frls}
                            onChange={handleChange}
                            required
                            options={[
                                { value: 'FRLS', label: 'FRLS' },
                                { value: 'NON_FRLS', label: 'Non-FRLS' }
                            ]}
                        />

                        <FormInput
                            label="Make"
                            type="text"
                            name="make"
                            value={formData.make}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Polycab"
                        />

                        <FormInput
                            label="Part Number"
                            type="text"
                            name="partNo"
                            value={formData.partNo}
                            onChange={handleChange}
                            placeholder="Optional"
                        />

                        <FormInput
                            label="Initial Quantity"
                            type="number"
                            name="initialQuantity"
                            value={formData.initialQuantity}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="e.g., 1000"
                        />

                        <FormSelect
                            label="Godown"
                            name="godownId"
                            value={formData.godownId}
                            onChange={handleChange}
                            required
                            options={godownOptions}
                        />

                        <FormInput
                            label="Site"
                            type="text"
                            name="site"
                            value={formData.site}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Main Warehouse"
                        />

                        <FormInput
                            label="Location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g., Rack A-12"
                        />
                    </div>

                    {/* Multi-Coil Fields */}
                    {isMultiCoil && (
                        <div className="border-t pt-4 sm:pt-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                                Multi-Coil Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormInput
                                    label="Number of Cartons"
                                    type="number"
                                    name="numberOfCartons"
                                    value={formData.numberOfCartons}
                                    onChange={handleChange}
                                    required={isMultiCoil}
                                    min="1"
                                    placeholder="e.g., 10"
                                />

                                <FormInput
                                    label="Coils per Carton"
                                    type="number"
                                    name="coilsPerCarton"
                                    value={formData.coilsPerCarton}
                                    onChange={handleChange}
                                    required={isMultiCoil}
                                    min="1"
                                    placeholder="e.g., 5"
                                />

                                <FormInput
                                    label="Quantity per Coil (m)"
                                    type="number"
                                    name="qtyPerCoil"
                                    value={formData.qtyPerCoil}
                                    onChange={handleChange}
                                    required={isMultiCoil}
                                    min="0"
                                    step="0.01"
                                    placeholder="e.g., 100"
                                />
                            </div>

                            {totalCoils > 0 && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Total Coils:</span> {totalCoils}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Details */}
                    <FormTextarea
                        label="Details / Description"
                        name="details"
                        value={formData.details}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Additional details about the cable..."
                    />

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                'Add Cable Stock'
                            )}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
