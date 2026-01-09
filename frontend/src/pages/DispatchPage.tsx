import { useState } from 'react';
import { CableDispatchForm } from './CableDispatchForm';
import { MultiCoilDispatchForm } from './MultiCoilDispatchForm';
import { NonCableDispatchForm } from './NonCableDispatchForm';
import { ArrowRight, Layers, Scissors } from 'lucide-react';
import { clsx } from 'clsx';

export function DispatchPage() {
    const [activeTab, setActiveTab] = useState<'cut' | 'coil' | 'loose'>('cut');

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dispatch</h1>
                <p className="text-gray-600">Process outgoing orders</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 inline-flex flex-wrap mb-4">
                <button
                    onClick={() => setActiveTab('cut')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === 'cut'
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Scissors size={18} />
                    Cable Cutting
                </button>
                <button
                    onClick={() => setActiveTab('coil')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === 'coil'
                            ? "bg-indigo-50 text-indigo-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <Layers size={18} />
                    Multi-Coil
                </button>
                <button
                    onClick={() => setActiveTab('loose')}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        activeTab === 'loose'
                            ? "bg-cyan-50 text-cyan-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )}
                >
                    <ArrowRight size={18} />
                    Non-Cable / Loose
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                {activeTab === 'cut' && <CableDispatchForm onNavigate={() => { }} />}
                {activeTab === 'coil' && <MultiCoilDispatchForm onNavigate={() => { }} />}
                {activeTab === 'loose' && <NonCableDispatchForm onNavigate={() => { }} />}
            </div>
        </div>
    );
}
