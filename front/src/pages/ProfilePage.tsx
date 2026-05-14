import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api/user';
import { formatDate } from '../utils/formatters';
import { User, Mail, CreditCard, Building, Calendar, Shield, Bell, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getMe,
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const maskCpf = (cpf: string) => {
    if (!cpf) return '***.***.***-**';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.$3-**');
  };

  const settings = [
    { icon: Bell, label: 'Notifications', description: 'Manage your alerts' },
    { icon: Shield, label: 'Security', description: 'Password and 2FA' },
    { icon: CreditCard, label: 'Payment Methods', description: 'Cards and accounts' },
  ];

  if (isLoading) {
    return (
      <div className='space-y-6 max-w-2xl animate-pulse'>
        <div className='card p-8'>
          <div className='flex items-center gap-6'>
            <div className='w-24 h-24 rounded-full bg-cream-200' />
            <div className='space-y-2'>
              <div className='h-6 w-48 bg-cream-200 rounded' />
              <div className='h-4 w-32 bg-cream-200 rounded' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 max-w-2xl'>
      <div>
        <h1 className='text-2xl font-bold text-dark-800'>Profile</h1>
        <p className='text-gray-400 text-sm mt-1'>Manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className='card p-8'>
        <div className='flex items-center gap-6 mb-8'>
          <div className='w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center shadow-lg'>
            <span className='text-white text-3xl font-bold'>
              {user?.name ? getInitials(user.name) : 'U'}
            </span>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-dark-800'>{user?.name}</h2>
            <p className='text-gray-400'>{user?.email}</p>
            <span className='inline-flex items-center gap-1 mt-2 px-3 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full'>
              <span className='w-1.5 h-1.5 bg-green-500 rounded-full'></span>
              Active Account
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <User className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>Full Name</p>
            </div>
            <p className='text-dark-800 font-semibold'>{user?.name}</p>
          </div>

          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Mail className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>Email</p>
            </div>
            <p className='text-dark-800 font-semibold truncate'>{user?.email}</p>
          </div>

          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Shield className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>CPF</p>
            </div>
            <p className='text-dark-800 font-semibold'>{maskCpf(user?.cpf || '')}</p>
          </div>

          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Calendar className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>Member since</p>
            </div>
            <p className='text-dark-800 font-semibold'>
              {user?.createdAt ? formatDate(user.createdAt) : '-'}
            </p>
          </div>

          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <Building className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>Agency</p>
            </div>
            <p className='text-dark-800 font-semibold'>{user?.agency || '-'}</p>
          </div>

          <div className='bg-cream-100 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-2'>
              <CreditCard className='w-4 h-4 text-primary-500' />
              <p className='text-xs text-gray-400 font-medium'>Account</p>
            </div>
            <p className='text-dark-800 font-semibold'>{user?.accountNumber || '-'}</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className='card p-6'>
        <h3 className='font-semibold text-dark-800 mb-4'>Settings</h3>
        <div className='space-y-2'>
          {settings.map(({ icon: Icon, label, description }) => (
            <button key={label}
              className='w-full flex items-center justify-between p-4 rounded-xl hover:bg-cream-100 transition-colors group'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                  <Icon className='w-5 h-5 text-primary-500' />
                </div>
                <div className='text-left'>
                  <p className='text-sm font-medium text-dark-800'>{label}</p>
                  <p className='text-xs text-gray-400'>{description}</p>
                </div>
              </div>
              <ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors' />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}