import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CreditCard, ArrowLeftRight, TrendingUp, PieChart, User, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transfer' },
  { to: '/invest', icon: TrendingUp, label: 'Invest' },
  { to: '/analytics', icon: PieChart, label: 'Analytics' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className='fixed left-0 top-0 h-full w-64 bg-white flex flex-col z-50 shadow-sm'>
      <div className='p-6 border-b border-cream-200'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>$</span>
          </div>
          <div>
            <h1 className='font-bold text-dark-800 text-lg leading-none'>FinBank</h1>
            <p className='text-xs text-gray-400 mt-0.5'>Digital Banking</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
              }`
            }
          >
            <Icon className='w-5 h-5' />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className='p-4 border-t border-cream-200 space-y-1'>
        <button className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-primary-500 hover:bg-primary-50 transition-all text-sm font-medium'>
          <HelpCircle className='w-5 h-5' />
          Help & Support
        </button>
        <button onClick={handleLogout}
          className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium'>
          <LogOut className='w-5 h-5' />
          Logout
        </button>
      </div>
    </aside>
  );
}