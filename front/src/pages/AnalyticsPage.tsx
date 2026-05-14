import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, TrendingDown, ArrowLeftRight, DollarSign } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];

export default function AnalyticsPage() {
  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: accountApi.getMyAccount,
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: accountApi.getHistory,
  });

  const deposits = transactions.filter(t => t.type === 'DEPOSIT');
  const withdrawals = transactions.filter(t => t.type === 'WITHDRAWAL');
  const transfers = transactions.filter(t => t.type === 'TRANSFER');

  const totalDeposits = deposits.reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawals = withdrawals.reduce((s, t) => s + Number(t.amount), 0);
  const totalTransfers = transfers.reduce((s, t) => s + Number(t.amount), 0);

  const maxDeposit = deposits.length ? Math.max(...deposits.map(t => Number(t.amount))) : 0;
  const maxWithdrawal = withdrawals.length ? Math.max(...withdrawals.map(t => Number(t.amount))) : 0;
  const avgTransaction = transactions.length
    ? transactions.reduce((s, t) => s + Number(t.amount), 0) / transactions.length
    : 0;

  const pieData = [
    { name: 'Deposits', value: totalDeposits },
    { name: 'Withdrawals', value: totalWithdrawals },
    { name: 'Transfers', value: totalTransfers },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Deposits', value: totalDeposits, count: deposits.length },
    { name: 'Withdrawals', value: totalWithdrawals, count: withdrawals.length },
    { name: 'Transfers', value: totalTransfers, count: transfers.length },
  ];

  // Evolução do saldo ao longo do tempo
  const balanceEvolution = [...transactions]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .reduce((acc, t, i) => {
      const prev = acc[i - 1]?.balance || (account?.balance || 0);
      const delta = t.type === 'DEPOSIT' ? Number(t.amount) : -Number(t.amount);
      const date = new Date(t.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      return [...acc, { date, balance: prev + delta }];
    }, [] as { date: string; balance: number }[]);

  const stats = [
    { label: 'Total Deposits', value: formatCurrency(totalDeposits), icon: TrendingUp, color: 'bg-green-100', iconColor: 'text-green-500' },
    { label: 'Total Withdrawals', value: formatCurrency(totalWithdrawals), icon: TrendingDown, color: 'bg-red-100', iconColor: 'text-red-500' },
    { label: 'Total Transfers', value: formatCurrency(totalTransfers), icon: ArrowLeftRight, color: 'bg-blue-100', iconColor: 'text-blue-500' },
    { label: 'Current Balance', value: formatCurrency(account?.balance || 0), icon: DollarSign, color: 'bg-primary-100', iconColor: 'text-primary-500' },
  ];

  if (isLoading) {
    return (
      <div className='space-y-6 animate-pulse'>
        <div className='grid grid-cols-4 gap-4'>
          {[1,2,3,4].map(i => <div key={i} className='card h-28 bg-cream-200' />)}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-dark-800'>Analytics</h1>
        <p className='text-gray-400 text-sm mt-1'>Your financial overview</p>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-4 gap-4'>
        {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
          <div key={label} className='card p-5'>
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className='text-xs text-gray-400 mb-1'>{label}</p>
            <p className='text-lg font-bold text-dark-800'>{value}</p>
          </div>
        ))}
      </div>

      <div className='grid grid-cols-3 gap-6'>
        {/* Balance Evolution */}
        <div className='card p-6 col-span-2'>
          <h3 className='font-semibold text-dark-800 mb-4'>Balance Evolution</h3>
          {balanceEvolution.length > 0 ? (
            <ResponsiveContainer width='100%' height={220}>
              <AreaChart data={balanceEvolution}>
                <defs>
                  <linearGradient id='balanceGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#e8611a' stopOpacity={0.2} />
                    <stop offset='95%' stopColor='#e8611a' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey='date' stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [formatCurrency(Number(value)), 'Balance']}
                />
                <Area type='monotone' dataKey='balance' stroke='#e8611a' fill='url(#balanceGrad)' strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className='flex items-center justify-center h-48 text-gray-300'>
              No transaction data yet
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className='card p-6'>
          <h3 className='font-semibold text-dark-800 mb-4'>Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width='100%' height={180}>
                <PieChart>
                  <Pie data={pieData} cx='50%' cy='50%' innerRadius={50} outerRadius={80} dataKey='value'>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <div className='space-y-2 mt-2'>
                {pieData.map((item, i) => (
                  <div key={item.name} className='flex items-center justify-between text-xs'>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded-full' style={{ backgroundColor: COLORS[i] }} />
                      <span className='text-gray-500'>{item.name}</span>
                    </div>
                    <span className='font-medium text-dark-800'>{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className='flex items-center justify-center h-48 text-gray-300'>No data yet</div>
          )}
        </div>
      </div>

      {/* Bar Chart + Metrics */}
      <div className='grid grid-cols-3 gap-6'>
        <div className='card p-6 col-span-2'>
          <h3 className='font-semibold text-dark-800 mb-4'>Volume by Type</h3>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={barData}>
              <XAxis dataKey='name' stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke='#d1d5db' tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(value) => [formatCurrency(Number(value)), 'Volume']}
              />
              <Bar dataKey='value' radius={[8, 8, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className='card p-6'>
          <h3 className='font-semibold text-dark-800 mb-4'>Key Metrics</h3>
          <div className='space-y-4'>
            <div className='bg-cream-100 rounded-xl p-3'>
              <p className='text-xs text-gray-400'>Total Transactions</p>
              <p className='text-xl font-bold text-dark-800'>{transactions.length}</p>
            </div>
            <div className='bg-cream-100 rounded-xl p-3'>
              <p className='text-xs text-gray-400'>Largest Deposit</p>
              <p className='text-xl font-bold text-green-500'>{formatCurrency(maxDeposit)}</p>
            </div>
            <div className='bg-cream-100 rounded-xl p-3'>
              <p className='text-xs text-gray-400'>Largest Withdrawal</p>
              <p className='text-xl font-bold text-red-500'>{formatCurrency(maxWithdrawal)}</p>
            </div>
            <div className='bg-cream-100 rounded-xl p-3'>
              <p className='text-xs text-gray-400'>Average Transaction</p>
              <p className='text-xl font-bold text-dark-800'>{formatCurrency(avgTransaction)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}