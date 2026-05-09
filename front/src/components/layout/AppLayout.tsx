import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  return (
    <div className='flex min-h-screen bg-gradient-fintech'>
      <Sidebar />
      <main className='flex-1 ml-64 p-8'>
        <Outlet />
      </main>
    </div>
  );
}