import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Settings } from 'lucide-react';
import Notifications from '../ui/Notifications';

export default function AppLayout() {
  const { isAuthenticated, userName } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <div className='flex min-h-screen bg-cream-100'>
      <Sidebar />
      <main className='flex-1 ml-64'>
        <header className='flex items-center justify-between px-8 py-6'>
          <div>
            <p className='text-gray-400 text-sm'>{getGreeting()}</p>
            <h1 className='text-2xl font-bold text-dark-800'>{userName || 'Usuário'}</h1>
          </div>
          <div className='flex items-center gap-3'>
            <Notifications />
            <button
              onClick={() => navigate('/profile')}
              className='w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow'
              title='Settings'>
              <Settings className='w-5 h-5 text-gray-400' />
            </button>
          </div>
        </header>
        <div className='px-8 pb-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}