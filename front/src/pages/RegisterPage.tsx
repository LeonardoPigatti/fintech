import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', cpf: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(form);
    if (success) navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-cream-100 flex'>
      {/* Left side */}
      <div className='hidden lg:flex lg:w-1/2 bg-primary-500 flex-col justify-between p-12'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center'>
            <span className='text-white font-bold text-lg'>$</span>
          </div>
          <span className='text-white font-bold text-xl'>FinBank</span>
        </div>
        <div>
          <h2 className='text-4xl font-bold text-white mb-4'>
            Start your<br />financial journey.
          </h2>
          <p className='text-white/70 text-lg'>
            Create your account in minutes and take control of your money.
          </p>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          {[
            { label: 'Zero fees', value: '100%' },
            { label: 'Secure', value: '256-bit' },
            { label: 'Support', value: '24/7' },
            { label: 'Satisfaction', value: '4.9★' },
          ].map(stat => (
            <div key={stat.label} className='bg-white/10 rounded-2xl p-4'>
              <p className='text-2xl font-bold text-white'>{stat.value}</p>
              <p className='text-white/60 text-sm'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <div className='lg:hidden flex items-center gap-3 mb-8'>
            <div className='w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>$</span>
            </div>
            <span className='text-dark-800 font-bold text-xl'>FinBank</span>
          </div>

          <h1 className='text-3xl font-bold text-dark-800 mb-2'>Create account</h1>
          <p className='text-gray-400 mb-8'>Join thousands of users today</p>

          {error && (
            <div className='bg-red-50 border border-red-200 rounded-xl p-3 mb-6'>
              <p className='text-red-500 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>Full name</label>
              <input name='name' type='text' value={form.name} onChange={handleChange}
                className='w-full bg-white border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='João Silva' required />
            </div>

            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>Email</label>
              <input name='email' type='email' value={form.email} onChange={handleChange}
                className='w-full bg-white border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='seu@email.com' required />
            </div>

            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>CPF</label>
              <input name='cpf' type='text' value={form.cpf} onChange={handleChange}
                className='w-full bg-white border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='00000000000' maxLength={11} required />
            </div>

            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>Password</label>
              <div className='relative'>
                <input name='password' type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  className='w-full bg-white border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors pr-12'
                  placeholder='Mínimo 6 caracteres' minLength={6} required />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors'>
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
            </div>

            <button type='submit' disabled={loading}
              className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2'>
              {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <>Create Account <ArrowRight className='w-5 h-5' /></>}
            </button>
          </form>

          <p className='text-center text-gray-400 mt-6 text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='text-primary-500 hover:text-primary-600 font-medium transition-colors'>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}