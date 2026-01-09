import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    History,
    FileText,
    LogOut,
    Menu,
    X,
    Truck,
    Search,
    Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export function DashboardLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Define navigation items based on role
    const getNavItems = () => {
        const commonItems: { icon: any; label: string; path: string }[] = [];

        if (user?.role === 'Searcher') {
            return [
                { icon: Search, label: 'Search Inventory', path: '/' },
            ];
        }

        if (user?.role === 'StockInCharge') {
            return [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
                { icon: Upload, label: 'Stock In', path: '/stock-in' },
                { icon: Truck, label: 'Dispatch', path: '/dispatch' },
                { icon: History, label: 'History', path: '/history' },
            ];
        }

        if (user?.role === 'Supervisor') {
            return [
                { icon: LayoutDashboard, label: 'Overview', path: '/' },
                { icon: History, label: 'Transactions', path: '/history' },
                { icon: FileText, label: 'Reports', path: '/reports' },
            ];
        }

        return commonItems;
    };

    const navItems = getNavItems();

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col h-full",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 border-b border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">StockMgr</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="ml-auto lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    <div className="mb-6 px-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        location.pathname === item.path
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon size={18} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-3 px-3 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate capitalize">{user?.role?.replace('-', ' ')}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full">
                {/* Mobile Header */}
                <header className="h-16 bg-white border-b border-gray-200 lg:hidden flex items-center px-4 justify-between flex-shrink-0">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-gray-900">Stock Manager</span>
                    <div className="w-6" /> {/* Spacer */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
