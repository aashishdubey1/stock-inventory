import { useState } from 'react';
import { CableDispatchForm } from './CableDispatchForm';
import { NonCableDispatchForm } from './NonCableDispatchForm';
import { Scissors, Package } from 'lucide-react';
import { clsx } from 'clsx';

export function DispatchPage() {
    const [activeTab, setActiveTab] = useState<'cable' | 'loose'>('cable');

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="mb-4 sm:mb-6 px-4 sm:px-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dispatch</h1>
                <p className="text-sm sm:text-base text-gray-600">Process outgoing orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex mx-4 sm:mx-0">
                <button
                    onClick={() => setActiveTab('cable')}
                    className={clsx(
                        "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === 'cable'
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Scissors size={18} />
                    <span>Cable Drums</span>
                </button>
                <button
                    onClick={() => setActiveTab('loose')}
                    className={clsx(
                        "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                        activeTab === 'loose'
                            ? "bg-cyan-50 text-cyan-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Package size={18} />
                    <span>Non-Cable / Loose</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
                {activeTab === 'cable' && <CableDispatchForm onNavigate={() => { }} />}
                {activeTab === 'loose' && <NonCableDispatchForm onNavigate={() => { }} />}
            </div>
        </div>
    );
}
