import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { accountApi } from '../api/account';
import { cardsApi } from '../api/cards';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TrendingUp, TrendingDown, ArrowLeftRight, Copy, Send, Download, CreditCard, Zap, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useState, useRef } from 'react';

type SpendingFilter = 'week' | 'month' | 'all';
type SpendingType = 'all' | 'WITHDRAWAL' | 'TRANSFER' | 'DEPOSIT';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [spendingFilter, setSpendingFilter] = useState<SpendingFilter>('week');
  const [spendingType, setSpendingType] = useState<SpendingType>('all');
  const [cardIndex, setCardIndex] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);

  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account'],
    queryFn: accountApi.getMyAccount,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: accountApi.getHistory,
  });

  const { data: cards = [] } = useQuery({
    queryKey: ['cards'],
    queryFn: cardsApi.getMyCards,
  });

  const copyAccountNumber = () => {
    if (account) {
      navigator.clipboard.writeText(account.number);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Weekly Spending with filters
  const now = new Date();
  const getFilteredTransactions = () => {
    return transactions.filter(t => {
      const date = new Date(t.createdAt);
      const typeMatch = spendingType === 'all' || t.type === spendingType;

      if (spendingFilter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return date >= startOfWeek && typeMatch;
      } else if (spendingFilter === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return date >= startOfMonth && typeMatch;
      }
      return typeMatch;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = weekDays.map(day => ({ day, value: 0 }));
  filteredTransactions.forEach(t => {
    const date = new Date(t.createdAt);
    weeklyData[date.getDay()].value += Number(t.amount);
  });

  const totalSpending = weeklyData.reduce((s, d) => s + d.value, 0);
  const maxDay = weeklyData.reduce((max, d) => d.value > max.value ? d : max, weeklyData[0]);
  const avgDay = totalSpending / 7;

  const cardBgColor = (brand: string) => {
    if (brand === 'VISA') return 'bg-primary-500';
    if (brand === 'MASTERCARD') return 'bg-dark-800';
    if (brand === 'ELO') return 'bg-yellow-600';
    return 'bg-blue-700';
  };

  const visibleCard = cards[cardIndex];

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
            </div>
            {accountLoading ? (
              <div className='h-12 w-48 bg-white/20 rounded-lg animate-pulse mb-4' />
            ) : (
              <h2 className='text-4xl font-bold mb-1'>{formatCurrency(account?.balance || 0)}</h2>
            )}
            <div className='flex items-center gap-3 text-white/60 text-sm mb-6'>
              <span>Ag: {account?.agency || '----'} • Conta: {account?.number || '--------'}</span>
              <button
                onClick={copyAccountNumber}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${copySuccess ? 'bg-green-500/30 text-green-300' : 'bg-white/10 hover:bg-white/20 text-white/60'}`}>
                <Copy className='w-3 h-3' />
                <span className='text-xs'>{copySuccess ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className='flex gap-3'>
              <button onClick={() => navigate('/transactions?tab=deposit')}
                className='flex-1 flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl text-sm font-medium transition-all'>
                <Send className='w-4 h-4' /> Send Money
              </button>
              <button onClick={() => navigate('/transactions?tab=withdraw')}
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
              <h3 className='font-semibold text-dark-800'>Spending Overview</h3>
            </div>
            <div className='text-right'>
              <p className='font-bold text-dark-800'>{formatCurrency(totalSpending)}</p>
            </div>
          </div>

          {/* Filters */}
          <div className='flex gap-2 mb-4 flex-wrap'>
            <div className='flex gap-1 bg-cream-100 p-1 rounded-xl'>
              {(['week', 'month', 'all'] as SpendingFilter[]).map(f => (
                <button key={f} onClick={() => setSpendingFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${spendingFilter === f ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-dark-800'}`}>
                  {f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
                </button>
              ))}
            </div>
            <div className='flex gap-1 bg-cream-100 p-1 rounded-xl'>
              {([
                { key: 'all', label: 'All' },
                { key: 'DEPOSIT', label: 'Income' },
                { key: 'WITHDRAWAL', label: 'Expenses' },
                { key: 'TRANSFER', label: 'Transfers' },
              ] as { key: SpendingType; label: string }[]).map(f => (
                <button key={f.key} onClick={() => setSpendingType(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${spendingType === f.key ? 'bg-white text-primary-500 shadow-sm' : 'text-gray-400 hover:text-dark-800'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width='100%' height={180}>
            <BarChart data={weeklyData}>
              <XAxis dataKey='day' stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Amount']}
              />
              <Bar dataKey='value' fill='#e8611a' radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className='grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-cream-200'>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Average/day</p>
              <p className='font-semibold text-dark-800'>{formatCurrency(avgDay)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Highest day</p>
              <p className='font-semibold text-dark-800'>{maxDay.day} — {formatCurrency(maxDay.value)}</p>
            </div>
            <div className='text-center'>
              <p className='text-xs text-gray-400'>Transactions</p>
              <p className='font-semibold text-dark-800'>{filteredTransactions.length}</p>
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
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      t.type === 'DEPOSIT' ? 'bg-green-100' :
                      t.type === 'WITHDRAWAL' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      {t.type === 'DEPOSIT' ? <TrendingUp className='w-5 h-5 text-green-500' /> :
                       t.type === 'WITHDRAWAL' ? <TrendingDown className='w-5 h-5 text-red-500' /> :
                       <ArrowLeftRight className='w-5 h-5 text-blue-500' />}
                    </div>
                    <div>
                      <p className='text-sm font-medium text-dark-800'>
                        {t.type === 'DEPOSIT' ? 'Deposit received' :
                         t.type === 'WITHDRAWAL' ? 'Withdrawal' :
                         `Transfer to ${t.targetAccountNumber || 'account'}`}
                      </p>
                      {t.description && (
                        <p className='text-xs text-gray-500'>{t.description}</p>
                      )}
                      {t.type === 'TRANSFER' && t.sourceAccountNumber && (
                        <p className='text-xs text-gray-400'>From: {t.sourceAccountNumber}</p>
                      )}
                      <p className='text-xs text-gray-300'>{formatDate(t.createdAt)}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className={`font-semibold text-sm ${t.type === 'DEPOSIT' ? 'text-green-500' : 'text-red-500'}`}>
                      {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                      t.status === 'FAILED' ? 'bg-red-100 text-red-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {t.status === 'COMPLETED' ? 'Completed' : t.status === 'FAILED' ? 'Failed' : 'Pending'}
                    </span>
                  </div>
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
              <span className='text-xs text-gray-400'>{cards.length} Active</span>
            </button>
            <button onClick={() => navigate('/transactions?tab=pix')} className='flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 transition-colors card-hover'>
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
            <button onClick={() => navigate('/cards')} className='text-primary-500 text-sm font-medium flex items-center gap-1'>
              <Plus className='w-4 h-4' /> Add Card
            </button>
          </div>
          {cards.length === 0 ? (
            <div className='text-center py-4'>
              <p className='text-gray-400 text-sm mb-3'>No cards yet</p>
              <button onClick={() => navigate('/cards')}
                className='bg-primary-500 text-white text-xs px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors'>
                Add Card
              </button>
            </div>
          ) : (
            <div>
              {visibleCard && (
                <div className={`${cardBgColor(visibleCard.brand)} rounded-2xl p-4 text-white mb-3`}>
                  <div className='flex items-center justify-between mb-3'>
                    <p className='text-xs text-white/70'>{visibleCard.cardType} Card</p>
                    <CreditCard className='w-4 h-4 text-white/70' />
                  </div>
                  <p className='text-sm font-bold mb-2'>{visibleCard.brand}</p>
                  <p className='font-mono text-sm mb-3'>•••• •••• •••• {visibleCard.lastFour}</p>
                  <div className='flex items-center justify-between text-xs text-white/70'>
                    <span>{visibleCard.holderName}</span>
                    <span>{String(visibleCard.expiryMonth).padStart(2, '0')}/{visibleCard.expiryYear}</span>
                  </div>
                </div>
              )}
              {cards.length > 1 && (
                <div className='flex items-center justify-between'>
                  <button onClick={() => setCardIndex(i => Math.max(0, i - 1))}
                    disabled={cardIndex === 0}
                    className='w-8 h-8 rounded-full bg-cream-100 hover:bg-primary-50 flex items-center justify-center disabled:opacity-30 transition-all'>
                    <ChevronLeft className='w-4 h-4 text-dark-800' />
                  </button>
                  <div className='flex gap-1'>
                    {cards.map((_, i) => (
                      <button key={i} onClick={() => setCardIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === cardIndex ? 'bg-primary-500 w-4' : 'bg-cream-200'}`} />
                    ))}
                  </div>
                  <button onClick={() => setCardIndex(i => Math.min(cards.length - 1, i + 1))}
                    disabled={cardIndex === cards.length - 1}
                    className='w-8 h-8 rounded-full bg-cream-100 hover:bg-primary-50 flex items-center justify-center disabled:opacity-30 transition-all'>
                    <ChevronRight className='w-4 h-4 text-dark-800' />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PIX */}
        <div className='card p-6'>
          <h3 className='font-semibold text-dark-800 mb-4'>Pix & Transfers</h3>
          <div className='grid grid-cols-4 gap-2 mb-4'>
            {[
              { label: 'QR Code', tab: 'qrcode' },
              { label: 'Pix Key', tab: 'pix' },
              { label: 'Transfer', tab: 'transfer' },
              { label: 'Deposit', tab: 'deposit' },
            ].map(item => (
              <button key={item.label} onClick={() => navigate(`/transactions?tab=${item.tab}`)}
                className='flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-cream-100 transition-colors'>
                <div className='w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center'>
                  <Zap className='w-4 h-4 text-primary-500' />
                </div>
                <span className='text-xs text-gray-500'>{item.label}</span>
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
            <button onClick={copyAccountNumber}
              className='bg-primary-500 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary-600 transition-colors'>
              {copySuccess ? 'Copied!' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}