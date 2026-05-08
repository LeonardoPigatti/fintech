import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { formatCurrency, formatDate, getTransactionLabel, getTransactionColor } from '../utils/formatters';
import { TrendingUp, TrendingDown, ArrowLeftRight, Wallet, Copy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ['account'],
    queryFn: accountApi.getMyAccount,
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: accountApi.getHistory,
  });

  const deposits = transactions.filter(t => t.type === 'DEPOSIT').reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL').reduce((s, t) => s + t.amount, 0);
  const transfers = transactions.filter(t => t.type === 'TRANSFER').length;

  const chartData = transactions.slice(0, 7).reverse().map(t => ({
    date: formatDate(t.createdAt).split(' ')[0],
    value: t.amount,
    type: t.type,
  }));

  const copyAccountNumber = () => {
    if (account) navigator.clipboard.writeText(account.number);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-white'>Dashboard</h1>
        <p className='text-gray-400 text-sm mt-1'>Visão geral da sua conta</p>
      </div>

      {/* Balance Card */}
      <div className='relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-primary-600 to-purple-700 shadow-xl shadow-primary-500/20'>
        <div className='absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32' />
        <div className='absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24' />
        <div className='relative'>
          <div className='flex items-center justify-between mb-6'>
            <div>
              <p className='text-white/70 text-sm font-medium'>Saldo disponível</p>
              {accountLoading ? (
                <div className='h-10 w-48 bg-white/20 rounded-lg animate-pulse mt-1' />
              ) : (
                <h2 className='text-4xl font-bold text-white mt-1'>
                  {formatCurrency(account?.balance || 0)}
                </h2>
              )}
            </div>
            <div className='w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center'>
              <Wallet className='w-7 h-7 text-white' />
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div>
              <p className='text-white/60 text-xs'>Agência</p>
              <p className='text-white font-mono font-medium'>{account?.agency || '----'}</p>
            </div>
            <div className='w-px h-8 bg-white/20' />
            <div>
              <p className='text-white/60 text-xs'>Conta</p>
              <div className='flex items-center gap-2'>
                <p className='text-white font-mono font-medium'>{account?.number || '--------'}</p>
                <button onClick={copyAccountNumber} className='text-white/60 hover:text-white transition-colors'>
                  <Copy className='w-3.5 h-3.5' />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='glass rounded-2xl p-5 card-hover'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-gray-400 text-sm'>Entradas</p>
            <div className='w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center'>
              <TrendingUp className='w-4 h-4 text-emerald-400' />
            </div>
          </div>
          <p className='text-xl font-bold text-emerald-400'>{formatCurrency(deposits)}</p>
        </div>
        <div className='glass rounded-2xl p-5 card-hover'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-gray-400 text-sm'>Saídas</p>
            <div className='w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center'>
              <TrendingDown className='w-4 h-4 text-red-400' />
            </div>
          </div>
          <p className='text-xl font-bold text-red-400'>{formatCurrency(withdrawals)}</p>
        </div>
        <div className='glass rounded-2xl p-5 card-hover'>
          <div className='flex items-center justify-between mb-3'>
            <p className='text-gray-400 text-sm'>Transferências</p>
            <div className='w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center'>
              <ArrowLeftRight className='w-4 h-4 text-blue-400' />
            </div>
          </div>
          <p className='text-xl font-bold text-blue-400'>{transfers}</p>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className='glass rounded-2xl p-6'>
          <h3 className='text-white font-semibold mb-4'>Movimentações recentes</h3>
          <ResponsiveContainer width='100%' height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#4f6ef7' stopOpacity={0.3} />
                  <stop offset='95%' stopColor='#4f6ef7' stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey='date' stroke='#4b5563' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke='#4b5563' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                formatter={(value: number) => [formatCurrency(value), 'Valor']}
              />
              <Area type='monotone' dataKey='value' stroke='#4f6ef7' fill='url(#colorValue)' strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Transactions */}
      <div className='glass rounded-2xl p-6'>
        <h3 className='text-white font-semibold mb-4'>Últimas transações</h3>
        {transactions.length === 0 ? (
          <p className='text-gray-400 text-sm text-center py-8'>Nenhuma transação ainda</p>
        ) : (
          <div className='space-y-3'>
            {transactions.slice(0, 5).map(t => (
              <div key={t.id} className='flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors'>
                <div className='flex items-center gap-3'>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'DEPOSIT' ? 'bg-emerald-500/20' :
                    t.type === 'WITHDRAWAL' ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    {t.type === 'DEPOSIT' ? <TrendingUp className='w-5 h-5 text-emerald-400' /> :
                     t.type === 'WITHDRAWAL' ? <TrendingDown className='w-5 h-5 text-red-400' /> :
                     <ArrowLeftRight className='w-5 h-5 text-blue-400' />}
                  </div>
                  <div>
                    <p className='text-white text-sm font-medium'>{getTransactionLabel(t.type)}</p>
                    <p className='text-gray-400 text-xs'>{formatDate(t.createdAt)}</p>
                  </div>
                </div>
                <p className={`font-semibold ${getTransactionColor(t.type)}`}>
                  {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}