import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { SearcherDashboard } from './pages/SearcherDashboard';
import { StockInChargeDashboard } from './pages/StockInChargeDashboard';
import { SupervisorDashboard } from './pages/SupervisorDashboard';
import { CableDispatchForm } from './pages/CableDispatchForm';
import { MultiCoilDispatchForm } from './pages/MultiCoilDispatchForm';
import { NonCableStockIn } from './pages/NonCableStockIn';
import { TransactionHistory } from './pages/TransactionHistory';
import { ReportsPage } from './pages/ReportsPage';
import { StockInPage } from './pages/StockInPage';
import { DispatchPage } from './pages/DispatchPage';
import { CableStockIn } from './pages/CableStockIn';
import { NonCableDispatchForm } from './pages/NonCableDispatchForm';
import { EditTransactionModal } from './pages/EditTransactionModal';

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Role-based Layout Redirector
const DashboardHome = () => {
  const { user } = useAuth();

  if (user?.role === 'Searcher') return <SearcherDashboard />;
  if (user?.role === 'StockInCharge') return <StockInChargeDashboard onNavigate={() => { }} />;
  if (user?.role === 'Supervisor') return <SupervisorDashboard onNavigate={() => { }} />;

  return <div>Unknown Access</div>;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/", element: <DashboardHome /> },
          { path: "/stock-in", element: <StockInPage /> },
          { path: "/dispatch", element: <DispatchPage /> },
          { path: "/history", element: <TransactionHistory onNavigate={() => { }} /> },
          { path: "/reports", element: <ReportsPage onNavigate={() => { }} /> },
          { path: "/edit-transaction", element: <EditTransactionModal onNavigate={() => { }} /> },
        ]
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
