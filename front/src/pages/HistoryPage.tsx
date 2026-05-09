import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { formatCurrency, formatDate, getTransactionLabel, getTransactionColor } from '../utils/formatters';
import { TrendingUp, TrendingDown, ArrowLeftRight, Search } from 'lucide-react';
import { useState } from 'react';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: accountApi.getHistory,
  });

  const filtered = transactions.filter(t => {
    const matchType = filter === 'ALL' || t.type === filter;
    const matchSearch = !search ||
      getTransactionLabel(t.type).toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.amount.toString().includes(search);
    return matchType && matchSearch;
  });

  const filters = [
    { key: 'ALL', label: 'Todos' },
    { key: 'DEPOSIT', label: 'Depósitos' },
    { key: 'WITHDRAWAL', label: 'Saques' },
    { key: 'TRANSFER', label: 'Transferências' },
  ];

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-white'>Extrato</h1>
        <p className='text-gray-400 text-sm mt-1'>Histórico completo de transações</p>
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
        <input
          type='text'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-full bg-dark-800 border border-dark-600 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors glass'
          placeholder='Buscar transações...'
        />
      </div>

      {/* Filters */}
      <div className='flex gap-2 flex-wrap'>
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                : 'glass text-gray-400 hover:text-white'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className='glass rounded-2xl overflow-hidden'>
        {isLoading ? (
          <div className='p-8 space-y-4'>
            {[1,2,3,4,5].map(i => (
              <div key={i} className='flex items-center gap-3 animate-pulse'>
                <div className='w-10 h-10 rounded-xl bg-dark-700' />
                <div className='flex-1'>
                  <div className='h-4 w-32 bg-dark-700 rounded mb-2' />
                  <div className='h-3 w-24 bg-dark-700 rounded' />
                </div>
                <div className='h-4 w-20 bg-dark-700 rounded' />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='p-12 text-center'>
            <div className='w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4'>
              <Search className='w-8 h-8 text-gray-500' />
            </div>
            <p className='text-gray-400'>Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className='divide-y divide-white/5'>
            {filtered.map(t => (
              <div key={t.id} className='flex items-center justify-between p-4 hover:bg-white/5 transition-colors'>
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
                    <p className='text-gray-500 text-xs mt-0.5'>
                      {t.description || (t.targetAccountNumber ? `Para: ${t.targetAccountNumber}` : formatDate(t.createdAt))}
                    </p>
                    <p className='text-gray-600 text-xs'>{formatDate(t.createdAt)}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className={`font-semibold text-sm ${getTransactionColor(t.type)}`}>
                    {t.type === 'DEPOSIT' ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    t.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                    t.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {t.status === 'COMPLETED' ? 'Concluído' : t.status === 'FAILED' ? 'Falhou' : 'Pendente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}