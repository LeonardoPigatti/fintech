import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/user';
import { formatDate } from '../utils/formatters';
import { User, Mail, CreditCard, Building, Calendar, Shield, Bell, ChevronRight, X, Loader2, Eye, EyeOff, Check } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [showNotifSuccess, setShowNotifSuccess] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userApi.getMe,
  });

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordError('');
    },
    onError: (error: any) => {
      setPasswordError(error.response?.data?.error || 'Senha atual incorreta');
    },
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    changePasswordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleNotifications = () => {
    setNotifications(!notifications);
    setShowNotifSuccess(true);
    setTimeout(() => setShowNotifSuccess(false), 2000);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const maskCpf = (cpf: string) => {
    if (!cpf) return '***.***.***-**';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.$2.$3-**');
  };

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

          {/* Notifications */}
          <div className='flex items-center justify-between p-4 rounded-xl hover:bg-cream-100 transition-colors'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                <Bell className='w-5 h-5 text-primary-500' />
              </div>
              <div>
                <p className='text-sm font-medium text-dark-800'>Notifications</p>
                <p className='text-xs text-gray-400'>Manage your alerts</p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              {showNotifSuccess && <Check className='w-4 h-4 text-green-500' />}
              <button onClick={handleNotifications}
                className={`relative w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary-500' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Security */}
          <button onClick={() => setShowPasswordModal(true)}
            className='w-full flex items-center justify-between p-4 rounded-xl hover:bg-cream-100 transition-colors group'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                <Shield className='w-5 h-5 text-primary-500' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium text-dark-800'>Security</p>
                <p className='text-xs text-gray-400'>Change your password</p>
              </div>
            </div>
            <ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors' />
          </button>

          {/* Payment Methods */}
          <button onClick={() => navigate('/cards')}
            className='w-full flex items-center justify-between p-4 rounded-xl hover:bg-cream-100 transition-colors group'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                <CreditCard className='w-5 h-5 text-primary-500' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-medium text-dark-800'>Payment Methods</p>
                <p className='text-xs text-gray-400'>Manage your cards</p>
              </div>
            </div>
            <ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-primary-500 transition-colors' />
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-dark-800'>Change Password</h2>
              <button onClick={() => { setShowPasswordModal(false); setPasswordError(''); }}
                className='text-gray-400 hover:text-dark-800 transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className='space-y-4'>
              {passwordError && (
                <div className='bg-red-50 border border-red-200 rounded-xl p-3'>
                  <p className='text-red-500 text-sm'>{passwordError}</p>
                </div>
              )}

              <div>
                <label className='block text-xs font-medium text-dark-800 mb-2'>Current Password</label>
                <div className='relative'>
                  <input type={showCurrent ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 focus:outline-none focus:border-primary-500 pr-12'
                    placeholder='••••••••' required />
                  <button type='button' onClick={() => setShowCurrent(!showCurrent)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    {showCurrent ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-xs font-medium text-dark-800 mb-2'>New Password</label>
                <div className='relative'>
                  <input type={showNew ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 focus:outline-none focus:border-primary-500 pr-12'
                    placeholder='••••••••' minLength={6} required />
                  <button type='button' onClick={() => setShowNew(!showNew)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400'>
                    {showNew ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
                  </button>
                </div>
              </div>

              <div>
                <label className='block text-xs font-medium text-dark-800 mb-2'>Confirm New Password</label>
                <input type='password'
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 focus:outline-none focus:border-primary-500'
                  placeholder='••••••••' required />
              </div>

              <button type='submit' disabled={changePasswordMutation.isPending}
                className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2'>
                {changePasswordMutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}