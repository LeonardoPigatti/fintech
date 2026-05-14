import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { TrendingUp, TrendingDown, ArrowLeftRight, Loader2, CheckCircle, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

type TabType = 'deposit' | 'withdraw' | 'transfer' | 'pix';

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabType>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [success, setSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        amount: parseFloat(amount),
        description,
        targetAccountNumber: tab === 'transfer' ? targetAccount : undefined,
      };
      if (tab === 'deposit') return accountApi.deposit(data);
      if (tab === 'withdraw') return accountApi.withdraw(data);
      if (tab === 'transfer') return accountApi.transfer(data);
      return accountApi.transfer({ amount: parseFloat(amount), description, targetAccountNumber: targetAccount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccess(true);
      setAmount('');
      setDescription('');
      setTargetAccount('');
      setPixKey('');
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const tabs = [
    { key: 'deposit' as TabType, label: 'Deposit', icon: TrendingUp, color: 'text-green-500' },
    { key: 'withdraw' as TabType, label: 'Withdraw', icon: TrendingDown, color: 'text-red-500' },
    { key: 'transfer' as TabType, label: 'Transfer', icon: ArrowLeftRight, color: 'text-blue-500' },
    { key: 'pix' as TabType, label: 'PIX', icon: Zap, color: 'text-primary-500' },
  ];

  return (
    <div className='max-w-2xl space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-dark-800'>Transfer & Payments</h1>
        <p className='text-gray-400 text-sm mt-1'>Move your money quickly and securely</p>
      </div>

      {/* Tabs */}
      <div className='card p-2 flex gap-1'>
        {tabs.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => { setTab(key); setSuccess(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
            }`}>
            <Icon className='w-4 h-4' />
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className='card p-6'>
        {success && (
          <div className='flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-6'>
            <CheckCircle className='w-5 h-5 text-green-500 shrink-0' />
            <p className='text-green-600 text-sm font-medium'>Transaction completed successfully!</p>
          </div>
        )}

        {mutation.isError && (
          <div className='bg-red-50 border border-red-200 rounded-xl p-4 mb-6'>
            <p className='text-red-500 text-sm'>{(mutation.error as any)?.response?.data?.error || 'Transaction failed'}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-dark-800 mb-2'>Amount</label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>R$</span>
              <input type='number' value={amount} onChange={e => setAmount(e.target.value)}
                className='w-full bg-cream-100 border border-cream-200 rounded-xl pl-10 pr-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='0,00' min='0.01' step='0.01' />
            </div>
          </div>

          {(tab === 'transfer') && (
            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>Account number</label>
              <input type='text' value={targetAccount} onChange={e => setTargetAccount(e.target.value)}
                className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='Número da conta destino' />
            </div>
          )}

          {tab === 'pix' && (
            <div>
              <label className='block text-sm font-medium text-dark-800 mb-2'>PIX Key</label>
              <input type='text' value={pixKey} onChange={e => setPixKey(e.target.value)}
                className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='Email, CPF, telefone ou chave aleatória' />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-dark-800 mb-2'>
              Description <span className='text-gray-300 font-normal'>(optional)</span>
            </label>
            <input type='text' value={description} onChange={e => setDescription(e.target.value)}
              className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
              placeholder='Ex: Payment for services' />
          </div>

          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !amount}
            className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2'>
            {mutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : (
              <>
                {tab === 'deposit' && <><TrendingUp className='w-5 h-5' /> Confirm Deposit</>}
                {tab === 'withdraw' && <><TrendingDown className='w-5 h-5' /> Confirm Withdrawal</>}
                {tab === 'transfer' && <><ArrowLeftRight className='w-5 h-5' /> Confirm Transfer</>}
                {tab === 'pix' && <><Zap className='w-5 h-5' /> Send PIX</>}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick amounts */}
      <div className='card p-4'>
        <p className='text-gray-400 text-xs font-medium mb-3'>Quick amounts</p>
        <div className='grid grid-cols-4 gap-2'>
          {[50, 100, 500, 1000].map(v => (
            <button key={v} onClick={() => setAmount(String(v))}
              className='py-2 rounded-xl bg-cream-100 hover:bg-primary-50 hover:text-primary-500 text-gray-500 text-sm font-medium transition-all border border-cream-200 hover:border-primary-200'>
              {formatCurrency(v)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}