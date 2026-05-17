import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, ArrowRight, Loader2, ShieldCheck, User, Mail, CreditCard } from 'lucide-react';

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
    <div className='min-h-screen flex' style={{ fontFamily: "'DM Sans', sans-serif", background: '#0f0d0b' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .fb-input {
          width: 100%;
          height: 50px;
          background: #fff;
          border: 1px solid rgba(139,100,65,0.18);
          border-radius: 12px;
          padding: 0 44px 0 16px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #1a1208;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-weight: 300;
        }
        .fb-input::placeholder { color: rgba(154,118,85,0.5); }
        .fb-input:focus { border-color: #e8611a; box-shadow: 0 0 0 3px rgba(232,97,26,0.08); }

        .fb-btn {
          width: 100%;
          height: 52px;
          background: #e8611a;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
        }
        .fb-btn:hover:not(:disabled) { background: #d45515; transform: translateY(-1px); }
        .fb-btn:active:not(:disabled) { transform: translateY(0); }
        .fb-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .geo-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(232,97,26,0.15);
          pointer-events: none;
        }
        .dot-grid {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 200px;
          background-image: radial-gradient(rgba(232,97,26,0.2) 1px, transparent 1px);
          background-size: 22px 22px;
          -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          mask-image: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
          pointer-events: none;
        }
        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 16px 18px;
          transition: border-color 0.2s;
        }
        .stat-card:hover { border-color: rgba(232,97,26,0.3); }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className='hidden lg:flex lg:w-[52%] flex-col justify-between p-10 relative overflow-hidden'
        style={{ background: '#0f0d0b' }}>

        <div className='geo-circle' style={{ width: 420, height: 420, top: -110, left: -130 }} />
        <div className='geo-circle' style={{ width: 270, height: 270, top: 30, left: 20, borderColor: 'rgba(232,97,26,0.08)' }} />
        <div className='geo-circle' style={{ width: 180, height: 180, bottom: 60, right: -40, borderColor: 'rgba(232,97,26,0.12)' }} />
        <div className='geo-circle' style={{ width: 80, height: 80, bottom: 140, right: 40, borderColor: 'rgba(232,97,26,0.22)' }} />
        <div className='dot-grid' />

        {/* Logo */}
        <div className='flex items-center gap-3 relative z-10'>
          <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: '#e8611a' }}>
            <span className='text-white font-bold text-base'>$</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#faf0e6', letterSpacing: '0.01em' }}>
            FinBank
          </span>
        </div>

        {/* Tagline */}
        <div className='relative z-10'>
          <div className='flex items-center gap-2 mb-4' style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e8611a' }}>
            <span style={{ display: 'block', width: 28, height: 1, background: '#e8611a', flexShrink: 0 }} />
            Open an account
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, lineHeight: 1.1, color: '#faf0e6', fontWeight: 400, marginBottom: 16 }}>
            Start your<br />
            <em style={{ fontStyle: 'italic', color: '#e8611a' }}>financial journey.</em>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(250,240,230,0.45)', fontWeight: 300, lineHeight: 1.65, maxWidth: 300 }}>
            Create your account in minutes and take full control of your money, anywhere.
          </p>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-3 relative z-10'>
          {[
            { label: 'Zero fees', value: '100%' },
            { label: 'Encryption', value: '256-bit' },
            { label: 'Support', value: '24/7' },
            { label: 'Satisfaction', value: '4.9★' },
          ].map(stat => (
            <div key={stat.label} className='stat-card'>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: '#faf0e6', fontWeight: 600, letterSpacing: '-0.01em' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 11, color: 'rgba(250,240,230,0.35)', marginTop: 2, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical divider */}
      <div className='hidden lg:block w-px flex-shrink-0'
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(232,97,26,0.25) 30%, rgba(232,97,26,0.25) 70%, transparent)' }} />

      {/* ── RIGHT PANEL ── */}
      <div className='flex-1 flex items-center justify-center p-8' style={{ background: '#faf0e6' }}>
        <div className='w-full max-w-sm'>

          {/* Mobile logo */}
          <div className='lg:hidden flex items-center gap-3 mb-10'>
            <div className='w-9 h-9 rounded-xl flex items-center justify-center' style={{ background: '#e8611a' }}>
              <span className='text-white font-bold text-base'>$</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#1a1208' }}>FinBank</span>
          </div>

          {/* Header */}
          <div className='flex items-center gap-2 mb-3' style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#e8611a' }}>
            <span style={{ display: 'block', width: 20, height: 1, background: '#e8611a', flexShrink: 0 }} />
            New account
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, color: '#1a1208', fontWeight: 400, lineHeight: 1.1, marginBottom: 6 }}>
            Create account
          </h2>
          <p style={{ fontSize: 13, color: '#9c7a5a', marginBottom: 28, fontWeight: 300 }}>
            Join thousands of users today
          </p>

          {/* Error */}
          {error && (
            <div className='rounded-xl p-3 mb-5' style={{ background: 'rgba(220,38,38,0.08)', border: '0.5px solid rgba(220,38,38,0.25)' }}>
              <p style={{ color: '#b91c1c', fontSize: 13 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5c3e', marginBottom: 7, fontWeight: 500 }}>
                Full name
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name='name' type='text' value={form.name} onChange={handleChange}
                  className='fb-input' placeholder='João Silva' required
                />
                <User style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(154,118,85,0.5)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5c3e', marginBottom: 7, fontWeight: 500 }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name='email' type='email' value={form.email} onChange={handleChange}
                  className='fb-input' placeholder='you@email.com' required
                />
                <Mail style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(154,118,85,0.5)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* CPF */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5c3e', marginBottom: 7, fontWeight: 500 }}>
                CPF
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name='cpf' type='text' value={form.cpf} onChange={handleChange}
                  className='fb-input' placeholder='00000000000' maxLength={11} required
                />
                <CreditCard style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: 'rgba(154,118,85,0.5)', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: 'block', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5c3e', marginBottom: 7, fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name='password' type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  className='fb-input' placeholder='Min. 6 characters' minLength={6} required
                />
                <button type='button' onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(154,118,85,0.5)', display: 'flex' }}>
                  {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type='submit' disabled={loading} className='fb-btn'>
              {loading
                ? <Loader2 style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} />
                : <><span>Create Account</span><ArrowRight style={{ width: 16, height: 16 }} /></>
              }
            </button>
          </form>

          {/* Security note */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(232,97,26,0.06)', border: '0.5px solid rgba(232,97,26,0.15)', borderRadius: 10, padding: '10px 14px', marginTop: 20 }}>
            <ShieldCheck style={{ width: 15, height: 15, color: '#e8611a', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 11, color: '#9c7a5a', lineHeight: 1.5 }}>
              Your data is protected with 256-bit encryption. We never share your information.
            </span>
          </div>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#9c7a5a' }}>
            Already have an account?{' '}
            <Link to='/login' style={{ color: '#e8611a', textDecoration: 'none', fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}