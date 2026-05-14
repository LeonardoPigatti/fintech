import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { accountApi } from '../api/account';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TrendingUp, TrendingDown, ArrowLeftRight, Copy, Send, Download, CreditCard, Zap, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockCards = [
  { type: 'Credit Card', name: 'Premium', number: '4532 •••• •••• 8392', holder: 'Sarah Johnson', expires: '12/28', balance: null, color: 'bg-primary-500' },
  { type: 'Debit Card', name: 'Classic', number: '5234 •••• •••• 1847', holder: 'Sarah Johnson', expires: '09/27', balance: 12450.30, color: 'bg-dark-800' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account'],
    queryFn: accountApi.getMyAccount,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: accountApi.getHistory,
  });

  const copyAccountNumber = () => {
    if (account) navigator.clipboard.writeText(account.number);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = weekDays.map(day => ({ day, value: 0 }));

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  transactions.forEach(t => {
    const date = new Date(t.createdAt);
    if (date >= startOfWeek && (t.type === 'WITHDRAWAL' || t.type === 'TRANSFER')) {
      weeklyData[date.getDay()].value += Number(t.amount);
    }
  });

  const totalWeekly = weeklyData.reduce((s, d) => s + d.value, 0);
  const maxDay = weeklyData.reduce((max, d) => d.value > max.value ? d : max, weeklyData[0]);
  const avgDay = totalWeekly / 7;

  return (
    <div className='grid grid-cols-3 gap-6'>

      {/* Left column */}
      <div className='col-span-2 space-y-6'>

        {/* Balance Card */}
        <div className='relative overflow-hidden rounded-2xl p-6 bg-primary-500 text-white'>
          <div className='absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16' />
          <div className='absolute bottom-0 left-1/2 w-64 h-64 bg-white/5 rounded-full translate-y-32' />
          <div className='relative'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-white/70 text-sm'>Total Balance</p>
              <button className='text-white/70 hover:text-white'>
                <Copy className='w-4 h-4' />
              </button>
            </div>
            {accountLoading ? (
              <div className='h-12 w-48 bg-white/20 rounded-lg animate-pulse mb-4' />
            ) : (
              <h2 className='text-4xl font-bold mb-1'>{formatCurrency(account?.balance || 0)}</h2>
            )}
            <p className='text-white/60 text-sm mb-6'>
              Ag: {account?.agency || '----'} • Conta: {account?.number || '--------'}
              <button onClick={copyAccountNumber} className='ml-2 text-white/60 hover:text-white'>
                <Copy className='w-3 h-3 inline' />
              </button>
            </p>
            <div className='flex gap-3'>
              <button onClick={() => navigate('/transactions')}
                className='flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-medium transition-all'>
                <Send className='w-4 h-4' /> Send Money
              </button>
              <button onClick={() => navigate('/transactions')}
                className='flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-medium transition-all'>
                <Download className='w-4 h-4' /> Receive
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Spending */}
        <div className='card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h3 className='font-semibold text-dark-800'>Weekly Spending</h3>
              <p className='text-xs text-gray-400'>
                {startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className='text-right'>
              <p className='font-bold text-dark-800'>{formatCurrency(totalWeekly)}</p>
              <p className='text-xs text-gray-400'>this week</p>
            </div>
          </div>
          <ResponsiveContainer width='100%' height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id='colorSpend' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#e8611a' stopOpacity={0.2} />
                  <stop offset='95%' stopColor='#e8611a' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='day' stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Spending']}
              />
              <Area type='monotone' dataKey='value' stroke='#e8611a' fill='url(#colorSpend)' strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-cream-200'>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Average/day</p>
              <p className='font-semibold text-dark-800'>{formatCurrency(avgDay)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Highest day</p>
              <p className='font-semibold text-dark-800'>{maxDay.day} - {formatCurrency(maxDay.value)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Transactions</p>
              <p className='font-semibold text-dark-800'>{transactions.length}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className='card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-dark-800'>Recent Transactions</h3>
            <button onClick={() => navigate('/history')} className='text-primary-500 text-sm font-medium hover:text-primary-600'>See all</button>
          </div>
          {transactions.length === 0 ? (
            <p className='text-gray-400 text-sm text-center py-8'>No transactions yet</p>
          ) : (
            <div className='space-y-3'>
              {transactions.slice(0, 6).map(t => (
                <div key={t.id} className='flex items-center justify-between py-2'>
                  <div className='flex items-center gap-3'>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      t.type === 'DEPOSIT' ? 'bg-green-100' :
                      t.type === 'WITHDRAWAL' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {t.type === 'DEPOSIT' ? <TrendingUp className='w-5 h-5 text-green-500' /> :
                       t.type === 'WITHDRAWAL' ? <TrendingDown className='w-5 h-5 text-red-500' /> :
                       <ArrowLeftRight className='w-5 h-5 text-blue-500' />}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-dark-800'>
                        {t.type === 'DEPOSIT' ? 'Deposit' : t.type === 'WITHDRAWAL' ? 'Withdrawal' : 'Transfer'}
                      </p>
                      <p className='text-xs text-gray-400'>{formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold text-sm ${t.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>
                    {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right column */}
      <div className='space-y-6'>

        {/* Quick Actions */}
        <div className='card p-6'>
          <div className='grid grid-cols-2 gap-3'>
            <button onClick={() => navigate('/cards')} className='flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 transition-colors card-hover'>
              <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm'>
                <CreditCard className='w-5 h-5 text-primary-500' />
              </div>
              <span className='text-xs font-medium text-dark-800'>My Cards</span>
              <span className='text-xs text-gray-400'>2 Active</span>
            </button>
            <button onClick={() => navigate('/transactions')} className='flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 transition-colors card-hover'>
              <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm'>
                <Zap className='w-5 h-5 text-primary-500' />
              </div>
              <span className='text-xs font-medium text-dark-800'>Pix Transfers</span>
              <span className='text-xs text-gray-400'>Quick Send</span>
            </button>
            <button onClick={() => navigate('/invest')} className='flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 transition-colors card-hover col-span-2'>
              <div className='w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm'>
                <TrendingUp className='w-5 h-5 text-primary-500' />
              </div>
              <span className='text-xs font-medium text-dark-800'>Investments</span>
              <span className='text-xs text-green-500'>+12.5%</span>
            </button>
          </div>
        </div>

        {/* My Cards */}
        <div className='card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-dark-800'>My Cards</h3>
            <button className='text-primary-500 text-sm font-medium flex items-center gap-1'>
              <Plus className='w-4 h-4' /> Add Card
            </button>
          </div>
          <div className='space-y-3'>
            {mockCards.map((card, i) => (
              <div key={i} className={`${card.color} rounded-2xl p-4 text-white`}>
                <div className='flex items-center justify-between mb-3'>
                  <p className='text-xs text-white/70'>{card.type}</p>
                  <CreditCard className='w-4 h-4 text-white/70' />
                </div>
                <p className='text-sm font-bold mb-3'>{card.name}</p>
                <p className='font-mono text-sm mb-3'>{card.number}</p>
                <div className='flex items-center justify-between text-xs text-white/70'>
                  <span>{card.holder}</span>
                  <span>{card.expires}</span>
                </div>
                {card.balance && (
                  <p className='text-white font-bold mt-2'>{formatCurrency(card.balance)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* PIX */}
        <div className='card p-6'>
          <h3 className='font-semibold text-dark-800 mb-4'>Pix & Transfers</h3>
          <div className='grid grid-cols-4 gap-2 mb-4'>
            {['QR Code', 'Pix Key', 'Contact', 'Bank'].map(item => (
              <button key={item} onClick={() => navigate('/transactions')} className='flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-cream-100 transition-colors'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-primary-500' />
                </div>
                <span className='text-xs text-gray-500'>{item}</span>
              </button>
            ))}
          </div>
          <div className='bg-cream-100 rounded-xl p-3 flex items-center justify-between'>
            <div>
              <p className='text-xs text-gray-400'>My Pix Key</p>
              <p className='text-sm font-medium text-dark-800 truncate max-w-32'>
                {account?.number || 'Loading...'}
              </p>
            </div>
            <button className='bg-primary-500 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors'>
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}