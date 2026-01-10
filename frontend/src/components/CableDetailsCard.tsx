import { Package } from 'lucide-react';

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

interface CableDetailsCardProps {
    cable: CableStock;
}

export function CableDetailsCard({ cable }: CableDetailsCardProps) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-4">
                <Package className="text-green-600 flex-shrink-0" size={20} />
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Cable Details</h2>
                {cable.isMultiCoil && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                        MULTI-COIL
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Drum Number" value={cable.drumNumber} />
                <DetailItem label="Size" value={cable.size} />
                <DetailItem
                    label="Type"
                    value={`${cable.conductorType} / ${cable.armourType} / ${cable.frls}`}
                />
                <DetailItem label="Make" value={cable.make} />
                <DetailItem
                    label="Present Quantity"
                    value={`${cable.presentQuantity} m`}
                    valueClassName="text-green-600 text-lg"
                />
                <DetailItem
                    label="Initial Quantity"
                    value={`${cable.initialQuantity} m`}
                />

                {cable.isMultiCoil && (
                    <>
                        <DetailItem
                            label="Coils Remaining"
                            value={`${cable.coilsRemaining} / ${cable.totalCoils}`}
                            valueClassName="text-blue-600"
                        />
                        <DetailItem
                            label="Quantity per Coil"
                            value={`${cable.qtyPerCoil} m`}
                        />
                    </>
                )}

                <div className="sm:col-span-2">
                    <DetailItem
                        label="Location"
                        value={`${cable.site}${cable.location ? ` - ${cable.location}` : ''}`}
                    />
                </div>
            </div>
        </div>
    );
}

interface DetailItemProps {
    label: string;
    value: string | number;
    valueClassName?: string;
}

function DetailItem({ label, value, valueClassName = '' }: DetailItemProps) {
    return (
        <div className="min-w-0">
            <p className="text-sm text-gray-500 mb-0.5">{label}</p>
            <p className={`font-semibold text-gray-900 truncate ${valueClassName}`}>
                {value}
            </p>
        </div>
    );
}
