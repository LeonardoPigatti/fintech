import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { userApi } from '../api/user';
import {
  TrendingUp, TrendingDown, ArrowLeftRight, Loader2, CheckCircle,
  Zap, QrCode, Copy, Check, ShieldCheck, Clock, Info,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import { useSearchParams } from 'react-router-dom';

type TabType = 'deposit' | 'withdraw' | 'transfer' | 'pix' | 'qrcode';

const TAB_META: Record<TabType, {
  label: string; icon: React.ElementType; color: string; bg: string;
  tip: string; limits: string; time: string;
}> = {
  deposit: {
    label: 'Deposit', icon: TrendingUp,
    color: '#16a34a', bg: '#f0fdf4',
    tip: 'Deposits are credited instantly to your balance.',
    limits: 'No minimum. No maximum.',
    time: 'Instant',
  },
  withdraw: {
    label: 'Withdraw', icon: TrendingDown,
    color: '#dc2626', bg: '#fef2f2',
    tip: 'Withdrawals are processed immediately during business hours.',
    limits: 'Min: R$ 1,00 — Max: account balance.',
    time: 'Up to 1 business day',
  },
  transfer: {
    label: 'Transfer', icon: ArrowLeftRight,
    color: '#2563eb', bg: '#eff6ff',
    tip: 'Transfer between FinBank accounts is instant and free.',
    limits: 'Min: R$ 0,01.',
    time: 'Instant',
  },
  pix: {
    label: 'PIX', icon: Zap,
    color: '#e8611a', bg: '#fff7ed',
    tip: 'PIX works 24/7, including weekends and holidays.',
    limits: 'Daily limit: R$ 20.000,00.',
    time: 'Instant (24/7)',
  },
  qrcode: {
    label: 'QR Code', icon: QrCode,
    color: '#7c3aed', bg: '#f5f3ff',
    tip: 'Share your QR Code to receive PIX payments from any bank.',
    limits: 'No limits to receive.',
    time: 'Instant',
  },
};

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'deposit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [pixKey, setPixKey] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: account } = useQuery({ queryKey: ['account'], queryFn: accountApi.getMyAccount });
  const { data: user }    = useQuery({ queryKey: ['user'],    queryFn: userApi.getMe });

  const pixPayload = account
    ? `00020126330014BR.GOV.BCB.PIX0111${account.number}5204000053039865802BR5913${(user?.name || 'Usuario').slice(0, 13)}6009SAO PAULO62070503***6304`
    : '';

  const copyPixKey = () => {
    if (account?.number) {
      navigator.clipboard.writeText(account.number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const data = { amount: parseFloat(amount), description, targetAccountNumber: tab === 'transfer' ? targetAccount : undefined };
      if (tab === 'deposit') return accountApi.deposit(data);
      if (tab === 'withdraw') return accountApi.withdraw(data);
      return accountApi.transfer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setSuccess(true);
      setAmount(''); setDescription(''); setTargetAccount(''); setPixKey('');
      setTimeout(() => setSuccess(false), 3000);
    },
  });

  const meta = TAB_META[tab];
  const tabs: TabType[] = ['deposit', 'withdraw', 'transfer', 'pix', 'qrcode'];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-dark-800'>Transfer & Payments</h1>
        <p className='text-gray-400 text-sm mt-1'>Move your money quickly and securely</p>
      </div>

      {/* Tabs */}
      <div className='card p-2 flex gap-1'>
        {tabs.map(key => {
          const { label, icon: Icon } = TAB_META[key];
          return (
            <button key={key} onClick={() => { setTab(key); setSuccess(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                tab === key ? 'bg-primary-500 text-white shadow-sm' : 'text-gray-500 hover:text-primary-500 hover:bg-primary-50'
              }`}>
              <Icon className='w-4 h-4' />
              {label}
            </button>
          );
        })}
      </div>

      <div className='grid grid-cols-3 gap-6'>

        {/* ── COLUNA ESQUERDA — formulário ── */}
        <div className='col-span-2 space-y-4'>

          {/* QR Code tab */}
          {tab === 'qrcode' ? (
            <div className='card p-6'>
              <div className='text-center'>
                <h3 className='font-semibold text-dark-800 mb-1'>My PIX QR Code</h3>
                <p className='text-gray-400 text-sm mb-6'>Share to receive payments from any bank</p>

                <div className='flex justify-center mb-6'>
                  <div className='p-5 bg-white rounded-2xl shadow-sm border border-cream-200 inline-block'>
                    {account ? (
                      <QRCodeSVG value={pixPayload} size={180} level='M' includeMargin={true} fgColor='#2d2d2d' />
                    ) : (
                      <div className='w-44 h-44 bg-cream-100 rounded-xl animate-pulse' />
                    )}
                  </div>
                </div>

                <div className='bg-cream-100 rounded-xl p-4 mb-3 text-left'>
                  <p className='text-xs text-gray-400 mb-1'>PIX Key (Account Number)</p>
                  <p className='text-dark-800 font-mono font-semibold text-lg'>{account?.number || '...'}</p>
                </div>

                <div className='grid grid-cols-2 gap-3 mb-5'>
                  <div className='bg-cream-100 rounded-xl p-3 text-left'>
                    <p className='text-xs text-gray-400 mb-1'>Name</p>
                    <p className='text-sm font-semibold text-dark-800 truncate'>{user?.name || '-'}</p>
                  </div>
                  <div className='bg-cream-100 rounded-xl p-3 text-left'>
                    <p className='text-xs text-gray-400 mb-1'>Agency</p>
                    <p className='text-sm font-semibold text-dark-800'>{account?.agency || '-'}</p>
                  </div>
                </div>

                <button onClick={copyPixKey}
                  className='w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl text-sm font-medium transition-all'>
                  {copied ? <><Check className='w-4 h-4' /> Copied!</> : <><Copy className='w-4 h-4' /> Copy PIX Key</>}
                </button>
              </div>
            </div>
          ) : (
            <div className='card p-6 space-y-4'>

              {success && (
                <div className='flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4'>
                  <CheckCircle className='w-5 h-5 text-green-500 shrink-0' />
                  <p className='text-green-600 text-sm font-medium'>Transaction completed successfully!</p>
                </div>
              )}

              {mutation.isError && (
                <div className='bg-red-50 border border-red-200 rounded-xl p-4'>
                  <p className='text-red-500 text-sm'>{(mutation.error as any)?.response?.data?.error || 'Transaction failed'}</p>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>Amount</label>
                <div className='relative'>
                  <span className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm'>R$</span>
                  <input type='number' value={amount} onChange={e => setAmount(e.target.value)}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl pl-10 pr-4 py-3.5 text-dark-800 text-lg font-semibold placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                    placeholder='0,00' min='0.01' step='0.01' />
                </div>
              </div>

              {/* Quick amounts */}
              <div className='grid grid-cols-4 gap-2'>
                {[50, 100, 500, 1000].map(v => (
                  <button key={v} onClick={() => setAmount(String(v))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      amount === String(v)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-cream-100 hover:bg-primary-50 hover:text-primary-500 text-gray-500 border-cream-200 hover:border-primary-200'
                    }`}>
                    {formatCurrency(v)}
                  </button>
                ))}
              </div>

              {/* Target account (transfer) */}
              {tab === 'transfer' && (
                <div>
                  <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>Destination account</label>
                  <input type='text' value={targetAccount} onChange={e => setTargetAccount(e.target.value)}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3.5 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                    placeholder='Account number' />
                </div>
              )}

              {/* PIX key */}
              {tab === 'pix' && (
                <div>
                  <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>PIX Key</label>
                  <input type='text' value={pixKey} onChange={e => setPixKey(e.target.value)}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3.5 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                    placeholder='Email, CPF, phone or random key' />
                </div>
              )}

              {/* Description */}
              <div>
                <label className='block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
                  Description <span className='text-gray-300 normal-case font-normal'>(optional)</span>
                </label>
                <input type='text' value={description} onChange={e => setDescription(e.target.value)}
                  className='w-full bg-cream-100 border border-cream-200 rounded-xl px-4 py-3.5 text-dark-800 placeholder-gray-300 focus:outline-none focus:border-primary-500 transition-colors'
                  placeholder='e.g. Rent, groceries, services...' />
              </div>

              {/* Submit */}
              <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !amount}
                className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm'>
                {mutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : (
                  <>
                    {tab === 'deposit'  && <><TrendingUp className='w-4 h-4' /> Confirm Deposit</>}
                    {tab === 'withdraw' && <><TrendingDown className='w-4 h-4' /> Confirm Withdrawal</>}
                    {tab === 'transfer' && <><ArrowLeftRight className='w-4 h-4' /> Confirm Transfer</>}
                    {tab === 'pix'      && <><Zap className='w-4 h-4' /> Send PIX</>}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* ── COLUNA DIREITA — info contextual ── */}
        <div className='space-y-4'>

          {/* Balance */}
          <div className='card p-5'>
            <p className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-1'>Available balance</p>
            <p className='text-2xl font-bold text-dark-800'>{formatCurrency(account?.balance || 0)}</p>
            <div className='mt-3 pt-3 border-t border-cream-200 flex items-center gap-2 text-xs text-gray-400'>
              <ShieldCheck className='w-3.5 h-3.5 text-green-500' />
              Funds protected by 256-bit encryption
            </div>
          </div>

          {/* Contextual info */}
          <div className='card p-5 space-y-4'>
            <div className='flex items-center gap-2 mb-1'>
              <div className='w-8 h-8 rounded-lg flex items-center justify-center' style={{ background: meta.bg }}>
                <meta.icon className='w-4 h-4' style={{ color: meta.color }} />
              </div>
              <p className='text-sm font-semibold text-dark-800'>{meta.label}</p>
            </div>

            {[
              { icon: Clock, label: 'Processing time', value: meta.time },
              { icon: Info,  label: 'Limits',          value: meta.limits },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className='flex items-start gap-3'>
                <div className='w-7 h-7 rounded-lg bg-cream-100 flex items-center justify-center shrink-0 mt-0.5'>
                  <Icon className='w-3.5 h-3.5 text-gray-400' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>{label}</p>
                  <p className='text-sm font-medium text-dark-800'>{value}</p>
                </div>
              </div>
            ))}

            <div className='bg-cream-100 rounded-xl p-3'>
              <p className='text-xs text-gray-500 leading-relaxed'>{meta.tip}</p>
            </div>
          </div>

          {/* Security */}
          <div className='card p-5'>
            <p className='text-xs font-medium text-dark-800 mb-3'>Security</p>
            <div className='space-y-2.5'>
              {[
                'End-to-end encryption',
                'Real-time fraud detection',
                'Transaction confirmation',
              ].map(item => (
                <div key={item} className='flex items-center gap-2.5'>
                  <div className='w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0'>
                    <Check className='w-3 h-3 text-green-500' />
                  </div>
                  <p className='text-xs text-gray-500'>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}