import { useState } from 'react';
import { CableStockIn } from './CableStockIn';
import { NonCableStockIn } from './NonCableStockIn';
import { Package, Upload } from 'lucide-react';
import { clsx } from 'clsx';

export function StockInPage() {
    const [activeTab, setActiveTab] = useState<'cable' | 'loose'>('cable');

    return (
        <div className="space-y-6">
            <div className="mb-1">
                <h1 className="text-2xl font-bold text-gray-900">Stock In</h1>
                <p className="text-gray-600">Add items to inventory</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex mb-4">
                <button
                    onClick={() => setActiveTab('cable')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === 'cable'
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">C</div>
                    Cable Drum
                </button>
                <button
                    onClick={() => setActiveTab('loose')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === 'loose'
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Upload size={18} />
                    Non-Cable / Loose
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                {activeTab === 'cable' ? (
                    <CableStockIn onNavigate={() => { }} />
                ) : (
                    <NonCableStockIn onNavigate={() => { }} />
                )}
            </div>
        </div>
    );
}
