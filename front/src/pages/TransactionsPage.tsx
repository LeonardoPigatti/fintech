import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { TrendingUp, TrendingDown, ArrowLeftRight, Loader2, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

type TabType = 'deposit' | 'withdraw' | 'transfer';

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabType>('deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
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
      return accountApi.transfer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccess(true);
      setAmount('');
      setDescription('');
      setTargetAccount('');
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const tabs = [
    { key: 'deposit' as TabType, label: 'Depósito', icon: TrendingUp, color: 'emerald' },
    { key: 'withdraw' as TabType, label: 'Saque', icon: TrendingDown, color: 'red' },
    { key: 'transfer' as TabType, label: 'Transferência', icon: ArrowLeftRight, color: 'blue' },
  ];

  const currentTab = tabs.find(t => t.key === tab)!;

  return (
    <div className='space-y-6 max-w-lg'>
      <div>
        <h1 className='text-2xl font-bold text-white'>Transações</h1>
        <p className='text-gray-400 text-sm mt-1'>Movimente sua conta</p>
      </div>

      {/* Tabs */}
      <div className='glass rounded-2xl p-1.5 flex gap-1'>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => { setTab(key); setSuccess(false); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
              tab === key ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-400 hover:text-white'
            }`}>
            <Icon className='w-4 h-4' />
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div className='glass rounded-2xl p-6'>
        {success && (
          <div className='flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-6'>
            <CheckCircle className='w-5 h-5 text-emerald-400 shrink-0' />
            <p className='text-emerald-400 text-sm font-medium'>Transação realizada com sucesso!</p>
          </div>
        )}

        {mutation.isError && (
          <div className='bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6'>
            <p className='text-red-400 text-sm'>{(mutation.error as any)?.response?.data?.error || 'Erro ao processar transação'}</p>
          </div>
        )}

        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Valor</label>
            <div className='relative'>
              <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium'>R$</span>
              <input
                type='number'
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className='w-full bg-dark-700 border border-dark-600 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='0,00'
                min='0.01'
                step='0.01'
              />
            </div>
          </div>

          {tab === 'transfer' && (
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Conta destino</label>
              <input
                type='text'
                value={targetAccount}
                onChange={e => setTargetAccount(e.target.value)}
                className='w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors'
                placeholder='Número da conta'
              />
            </div>
          )}

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Descrição <span className='text-gray-500'>(opcional)</span></label>
            <input
              type='text'
              value={description}
              onChange={e => setDescription(e.target.value)}
              className='w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors'
              placeholder='Ex: Pagamento de serviço'
            />
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !amount}
            className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 mt-2'
          >
            {mutation.isPending ? (
              <Loader2 className='w-5 h-5 animate-spin' />
            ) : (
              <>
                <currentTab.icon className='w-5 h-5' />
                Confirmar {currentTab.label}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick amounts */}
      <div className='glass rounded-2xl p-4'>
        <p className='text-gray-400 text-xs font-medium mb-3'>Valores rápidos</p>
        <div className='grid grid-cols-4 gap-2'>
          {[50, 100, 500, 1000].map(v => (
            <button key={v} onClick={() => setAmount(String(v))}
              className='py-2 rounded-xl bg-dark-700 hover:bg-primary-500/20 hover:text-primary-400 text-gray-400 text-sm font-medium transition-all border border-dark-600 hover:border-primary-500/30'>
              {formatCurrency(v)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}