import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentsApi } from '../api/investments';
import type { InvestmentType } from '../api/investments';
import { accountApi } from '../api/account';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TrendingUp, TrendingDown, Plus, Loader2, X, DollarSign } from 'lucide-react';

const investmentOptions: { type: InvestmentType; label: string; rate: string; risk: string; color: string; description: string }[] = [
  { type: 'CDB', label: 'CDB', rate: '12% a.a.', risk: 'Baixo', color: 'bg-blue-500', description: 'Certificado de Depósito Bancário — seguro e rentável' },
  { type: 'LCI', label: 'LCI', rate: '10% a.a.', risk: 'Baixo', color: 'bg-green-500', description: 'Letra de Crédito Imobiliário — isento de IR' },
  { type: 'LCA', label: 'LCA', rate: '10.5% a.a.', risk: 'Baixo', color: 'bg-emerald-500', description: 'Letra de Crédito do Agronegócio — isento de IR' },
  { type: 'TESOURO_DIRETO', label: 'Tesouro Direto', rate: '11% a.a.', risk: 'Baixo', color: 'bg-yellow-500', description: 'Títulos do governo federal — máxima segurança' },
  { type: 'ACOES', label: 'Ações', rate: '~15% a.a.', risk: 'Alto', color: 'bg-primary-500', description: 'Renda variável — maior potencial de retorno' },
];

export default function InvestPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<InvestmentType>('CDB');
  const [amount, setAmount] = useState('');

  const { data: investments = [], isLoading } = useQuery({
    queryKey: ['investments'],
    queryFn: investmentsApi.getMyInvestments,
  });

  const { data: account } = useQuery({
    queryKey: ['account'],
    queryFn: accountApi.getMyAccount,
  });

  const investMutation = useMutation({
    mutationFn: () => investmentsApi.invest({ investmentType: selectedType, amount: parseFloat(amount) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
      setShowForm(false);
      setAmount('');
    },
  });

  const redeemMutation = useMutation({
    mutationFn: investmentsApi.redeem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });

  const activeInvestments = investments.filter(i => i.status === 'ACTIVE');
  const redeemedInvestments = investments.filter(i => i.status === 'REDEEMED');
  const totalInvested = activeInvestments.reduce((s, i) => s + Number(i.amount), 0);
  const totalCurrent = activeInvestments.reduce((s, i) => s + Number(i.currentValue), 0);
  const totalProfit = totalCurrent - totalInvested;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-dark-800'>Investments</h1>
          <p className='text-gray-400 text-sm mt-1'>Grow your money intelligently</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className='flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all'>
          <Plus className='w-4 h-4' /> Invest Now
        </button>
      </div>

      {/* Summary */}
      <div className='grid grid-cols-3 gap-4'>
        <div className='card p-5'>
          <div className='w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3'>
            <DollarSign className='w-5 h-5 text-blue-500' />
          </div>
          <p className='text-xs text-gray-400 mb-1'>Total Invested</p>
          <p className='text-xl font-bold text-dark-800'>{formatCurrency(totalInvested)}</p>
        </div>
        <div className='card p-5'>
          <div className='w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center mb-3'>
            <TrendingUp className='w-5 h-5 text-primary-500' />
          </div>
          <p className='text-xs text-gray-400 mb-1'>Current Value</p>
          <p className='text-xl font-bold text-dark-800'>{formatCurrency(totalCurrent)}</p>
        </div>
        <div className='card p-5'>
          <div className={`w-10 h-10 rounded-xl ${totalProfit >= 0 ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mb-3`}>
            {totalProfit >= 0 ? <TrendingUp className='w-5 h-5 text-green-500' /> : <TrendingDown className='w-5 h-5 text-red-500' />}
          </div>
          <p className='text-xs text-gray-400 mb-1'>Total Profit</p>
          <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
          </p>
        </div>
      </div>

      {/* Active Investments */}
      <div className='card p-6'>
        <h3 className='font-semibold text-dark-800 mb-4'>Active Investments</h3>
        {isLoading ? (
          <div className='space-y-3 animate-pulse'>
            {[1,2].map(i => <div key={i} className='h-20 bg-cream-200 rounded-xl' />)}
          </div>
        ) : activeInvestments.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4'>
              <TrendingUp className='w-8 h-8 text-gray-300' />
            </div>
            <p className='text-dark-800 font-medium mb-1'>No investments yet</p>
            <p className='text-gray-400 text-sm mb-4'>Start investing and grow your money</p>
            <button onClick={() => setShowForm(true)}
              className='bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all'>
              Invest Now
            </button>
          </div>
        ) : (
          <div className='space-y-3'>
            {activeInvestments.map(inv => (
              <div key={inv.id} className='flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200'>
                <div className='flex items-center gap-3'>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    investmentOptions.find(o => o.type === inv.investmentType)?.color || 'bg-primary-500'
                  }`}>
                    <TrendingUp className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-dark-800'>{inv.investmentType.replace('_', ' ')}</p>
                    <p className='text-xs text-gray-400'>{inv.annualRate}% a.a. • {formatDate(inv.investedAt)}</p>
                  </div>
                </div>
                <div className='text-right flex items-center gap-4'>
                  <div>
                    <p className='text-sm font-bold text-dark-800'>{formatCurrency(Number(inv.currentValue))}</p>
                    <p className={`text-xs ${Number(inv.profitLoss) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Number(inv.profitLoss) >= 0 ? '+' : ''}{formatCurrency(Number(inv.profitLoss))}
                      {' '}({Number(inv.profitLossPercent).toFixed(2)}%)
                    </p>
                  </div>
                  <button onClick={() => redeemMutation.mutate(inv.id)}
                    disabled={redeemMutation.isPending}
                    className='bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white text-xs px-3 py-2 rounded-lg transition-all'>
                    {redeemMutation.isPending ? <Loader2 className='w-3 h-3 animate-spin' /> : 'Redeem'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redeemed */}
      {redeemedInvestments.length > 0 && (
        <div className='card p-6'>
          <h3 className='font-semibold text-dark-800 mb-4'>Redeemed Investments</h3>
          <div className='space-y-3'>
            {redeemedInvestments.map(inv => (
              <div key={inv.id} className='flex items-center justify-between p-4 bg-gray-50 rounded-xl opacity-60'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center'>
                    <TrendingUp className='w-5 h-5 text-gray-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-dark-800'>{inv.investmentType.replace('_', ' ')}</p>
                    <p className='text-xs text-gray-400'>Redeemed • {inv.redeemedAt ? formatDate(inv.redeemedAt) : ''}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm font-bold text-dark-800'>{formatCurrency(Number(inv.currentValue))}</p>
                  <p className={`text-xs ${Number(inv.profitLoss) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {Number(inv.profitLoss) >= 0 ? '+' : ''}{formatCurrency(Number(inv.profitLoss))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invest Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-lg'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-dark-800'>New Investment</h2>
              <button onClick={() => setShowForm(false)} className='text-gray-400 hover:text-dark-800 transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='mb-4'>
              <p className='text-xs text-gray-400 mb-1'>Available Balance</p>
              <p className='text-lg font-bold text-dark-800'>{formatCurrency(account?.balance || 0)}</p>
            </div>

            <div className='grid grid-cols-1 gap-2 mb-4'>
              {investmentOptions.map(opt => (
                <button key={opt.type} onClick={() => setSelectedType(opt.type)}
                  className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedType === opt.type ? 'border-primary-500 bg-primary-50' : 'border-cream-200 hover:border-primary-200'
                  }`}>
                  <div className='flex items-center gap-3'>
                    <div className={`w-8 h-8 rounded-lg ${opt.color} flex items-center justify-center`}>
                      <TrendingUp className='w-4 h-4 text-white' />
                    </div>
                    <div className='text-left'>
                      <p className='text-sm font-medium text-dark-800'>{opt.label}</p>
                      <p className='text-xs text-gray-400'>{opt.description}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-primary-500'>{opt.rate}</p>
                    <p className={`text-xs ${opt.risk === 'Alto' ? 'text-red-400' : 'text-green-400'}`}>{opt.risk} risk</p>
                  </div>
                </button>
              ))}
            </div>

            <div className='mb-4'>
              <label className='block text-xs font-medium text-dark-800 mb-2'>Amount to invest</label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>R$</span>
                <input type='number' value={amount} onChange={e => setAmount(e.target.value)}
                  className='w-full bg-cream-100 border border-cream-200 rounded-xl pl-10 pr-4 py-3 text-dark-800 focus:outline-none focus:border-primary-500'
                  placeholder='0,00' min='1' step='0.01' />
              </div>
            </div>

            <div className='grid grid-cols-4 gap-2 mb-4'>
              {[100, 500, 1000, 5000].map(v => (
                <button key={v} onClick={() => setAmount(String(v))}
                  className='py-2 rounded-xl bg-cream-100 hover:bg-primary-50 hover:text-primary-500 text-gray-500 text-sm font-medium transition-all border border-cream-200'>
                  {formatCurrency(v)}
                </button>
              ))}
            </div>

            <button onClick={() => investMutation.mutate()} disabled={investMutation.isPending || !amount}
              className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2'>
              {investMutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : <><TrendingUp className='w-5 h-5' /> Invest Now</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}