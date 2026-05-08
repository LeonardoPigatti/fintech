import { NavLink, useNavigate } from 'react-router-dom';
import { Landmark, LayoutDashboard, ArrowLeftRight, LogOut, History } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transações' },
  { to: '/history', icon: History, label: 'Extrato' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout, userName } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className='fixed left-0 top-0 h-full w-64 glass border-r border-white/10 flex flex-col z-50'>
      <div className='p-6 border-b border-white/10'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/30'>
            <Landmark className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1 className='font-bold text-white text-lg leading-none'>BankingAPI</h1>
            <p className='text-xs text-gray-400 mt-0.5'>Digital Wallet</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className='w-5 h-5' />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className='p-4 border-t border-white/10'>
        <div className='flex items-center gap-3 px-4 py-3 mb-2'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold'>
            {userName ? userName[0].toUpperCase() : 'U'}
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-white text-sm font-medium truncate'>{userName || 'Usuário'}</p>
            <p className='text-gray-400 text-xs'>Conta ativa</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium'>
          <LogOut className='w-5 h-5' />
          Sair
        </button>
      </div>
    </aside>
  );
}