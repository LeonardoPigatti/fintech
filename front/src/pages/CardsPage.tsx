import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardsApi } from '../api/cards';
import type { CreateCardRequest } from '../api/cards';
import { formatCurrency } from '../utils/formatters';
import { CreditCard, Plus, Trash2, Loader2, X } from 'lucide-react';

const brandColors: Record<string, string> = {
  VISA: 'bg-primary-500',
  MASTERCARD: 'bg-dark-800',
  ELO: 'bg-yellow-600',
  AMEX: 'bg-blue-700',
};

const brandLogos: Record<string, string> = {
  VISA: 'VISA',
  MASTERCARD: 'MC',
  ELO: 'ELO',
  AMEX: 'AMEX',
};

export default function CardsPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateCardRequest>({
    cardType: 'CREDIT',
    brand: 'VISA',
    holderName: '',
    lastFour: '',
    expiryMonth: 1,
    expiryYear: 2028,
    creditLimit: undefined,
  });

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['cards'],
    queryFn: cardsApi.getMyCards,
  });

  const createMutation = useMutation({
    mutationFn: cardsApi.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      setShowForm(false);
      setForm({ cardType: 'CREDIT', brand: 'VISA', holderName: '', lastFour: '', expiryMonth: 1, expiryYear: 2028 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: cardsApi.deleteCard,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cards'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-dark-800'>My Cards</h1>
          <p className='text-gray-400 text-sm mt-1'>Manage your credit and debit cards</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className='flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all'>
          <Plus className='w-4 h-4' /> Add Card
        </button>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className='grid grid-cols-2 gap-4'>
          {[1,2].map(i => <div key={i} className='h-48 rounded-2xl bg-cream-200 animate-pulse' />)}
        </div>
      ) : cards.length === 0 ? (
        <div className='card p-12 text-center'>
          <div className='w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4'>
            <CreditCard className='w-8 h-8 text-gray-300' />
          </div>
          <p className='text-dark-800 font-medium mb-1'>No cards yet</p>
          <p className='text-gray-400 text-sm mb-4'>Add your first card to get started</p>
          <button onClick={() => setShowForm(true)}
            className='bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-600 transition-all'>
            Add Card
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4'>
          {cards.map(card => (
            <div key={card.id} className={`${brandColors[card.brand]} rounded-2xl p-6 text-white relative overflow-hidden`}>
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10' />
              <div className='relative'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <p className='text-white/70 text-xs'>{card.cardType} Card</p>
                    <p className='font-bold'>{brandLogos[card.brand]}</p>
                  </div>
                  <button onClick={() => deleteMutation.mutate(card.id)}
                    className='w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors'>
                    {deleteMutation.isPending ? <Loader2 className='w-4 h-4 animate-spin' /> : <Trash2 className='w-4 h-4' />}
                  </button>
                </div>
                <p className='font-mono text-lg mb-4'>•••• •••• •••• {card.lastFour}</p>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-white/60 text-xs'>Card Holder</p>
                    <p className='font-medium text-sm'>{card.holderName}</p>
                  </div>
                  <div>
                    <p className='text-white/60 text-xs'>Expires</p>
                    <p className='font-medium text-sm'>
                      {String(card.expiryMonth).padStart(2, '0')}/{card.expiryYear}
                    </p>
                  </div>
                  {card.creditLimit && (
                    <div>
                      <p className='text-white/60 text-xs'>Limit</p>
                      <p className='font-medium text-sm'>{formatCurrency(card.creditLimit)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      {showForm && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-lg font-bold text-dark-800'>Add New Card</h2>
              <button onClick={() => setShowForm(false)} className='text-gray-400 hover:text-dark-800 transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-medium text-dark-800 mb-1'>Card Type</label>
                  <select value={form.cardType} onChange={e => setForm({ ...form, cardType: e.target.value as any })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'>
                    <option value='CREDIT'>Credit</option>
                    <option value='DEBIT'>Debit</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs font-medium text-dark-800 mb-1'>Brand</label>
                  <select value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value as any })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'>
                    <option value='VISA'>Visa</option>
                    <option value='MASTERCARD'>Mastercard</option>
                    <option value='ELO'>Elo</option>
                    <option value='AMEX'>Amex</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-xs font-medium text-dark-800 mb-1'>Holder Name</label>
                <input type='text' value={form.holderName} onChange={e => setForm({ ...form, holderName: e.target.value })}
                  className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'
                  placeholder='JOÃO SILVA' required />
              </div>

              <div>
                <label className='block text-xs font-medium text-dark-800 mb-1'>Last 4 digits</label>
                <input type='text' value={form.lastFour} onChange={e => setForm({ ...form, lastFour: e.target.value })}
                  className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'
                  placeholder='1234' maxLength={4} required />
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label className='block text-xs font-medium text-dark-800 mb-1'>Expiry Month</label>
                  <input type='number' value={form.expiryMonth} onChange={e => setForm({ ...form, expiryMonth: parseInt(e.target.value) })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'
                    min={1} max={12} required />
                </div>
                <div>
                  <label className='block text-xs font-medium text-dark-800 mb-1'>Expiry Year</label>
                  <input type='number' value={form.expiryYear} onChange={e => setForm({ ...form, expiryYear: parseInt(e.target.value) })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'
                    min={2024} required />
                </div>
              </div>

              {form.cardType === 'CREDIT' && (
                <div>
                  <label className='block text-xs font-medium text-dark-800 mb-1'>Credit Limit</label>
                  <input type='number' value={form.creditLimit || ''} onChange={e => setForm({ ...form, creditLimit: parseFloat(e.target.value) })}
                    className='w-full bg-cream-100 border border-cream-200 rounded-xl px-3 py-2.5 text-dark-800 text-sm focus:outline-none focus:border-primary-500'
                    placeholder='5000.00' />
                </div>
              )}

              <button type='submit' disabled={createMutation.isPending}
                className='w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2'>
                {createMutation.isPending ? <Loader2 className='w-5 h-5 animate-spin' /> : <><Plus className='w-5 h-5' /> Add Card</>}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}