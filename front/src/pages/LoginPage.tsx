import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Landmark, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) navigate('/dashboard');
  };

  return (
    <div className='min-h-screen bg-gradient-fintech flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 mb-4 shadow-lg shadow-primary-500/30'>
            <Landmark className='w-8 h-8 text-white' />
          </div>
          <h1 className='text-3xl font-bold gradient-text'>BankingAPI</h1>
          <p className='text-gray-400 mt-2'>Sua carteira digital segura</p>
        </div>

        <div className='glass rounded-2xl p-8'>
          <h2 className='text-xl font-semibold text-white mb-6'>Entrar na conta</h2>

          {error && (
            <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='seu@email.com'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Senha</label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors pr-12'
                  placeholder='••••••••'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20'
            >
              {loading ? (
                <Loader2 className='w-5 h-5 animate-spin' />
              ) : (
                <>
                  Entrar <ArrowRight className='w-5 h-5' />
                </>
              )}
            </button>
          </form>

          <p className='text-center text-gray-400 mt-6 text-sm'>
            Não tem conta?{' '}
            <Link to='/register' className='text-primary-500 hover:text-primary-400 font-medium transition-colors'>
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
