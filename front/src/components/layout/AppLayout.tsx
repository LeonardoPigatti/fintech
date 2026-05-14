import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { Settings } from 'lucide-react';
import Notifications from '../ui/Notifications';

export default function AppLayout() {
  const { isAuthenticated, userName } = useAuth();

  if (!isAuthenticated) return <Navigate to='/login' replace />;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
            <button className='w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow'>
              <Settings className='w-5 h-5 text-gray-400' />
            </button>
            <div className='w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>
                {userName ? getInitials(userName) : 'U'}
              </span>
            </div>
          </div>
        </header>
        <div className='px-8 pb-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}