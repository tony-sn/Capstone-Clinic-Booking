'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Banknote,
  Loader2,
  Filter,
} from 'lucide-react';
import { useInfiniteTransactions } from '@/hooks/transaction/useTransaction';
import { formatPaymentType } from '@/lib/utils';
import InfiniteScroll from '@/components/InfiniteScroll';
import { PaymentType } from '@/types/transaction';
import MedicalHistoryDetailModal from '@/components/new/forms/medical-history/medicalhistoryDetailForm';

export default function TransactionPage() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [paymentType, setPaymentType] = useState<PaymentType | ''>('');
  const [paid, setPaid] = useState<string>(''); // '' | 'true' | 'false'

  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (id: number) => {
    setSelectedMedicalHistoryId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicalHistoryId(null);
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfiniteTransactions({
    fromDate,
    toDate,
    paymentType: paymentType || undefined,
    paid: paid === '' ? undefined : paid === 'true',
  });

  const transactions = data?.pages.flatMap((p) => p.data || []) || [];

  const getIcon = (type: number | string) => {
    const label = formatPaymentType(type);
    if (label === 'Cash') return <DollarSign className="w-4 h-4 text-green-600" />;
    if (label === 'Card') return <CreditCard className="w-4 h-4 text-blue-600" />;
    if (label === 'Bank Transfer') return <Banknote className="w-4 h-4 text-yellow-600" />;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-gray-500" />
        Transaction Records
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="BankTransfer">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paid</label>
          <select
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All</option>
            <option value="true">Paid</option>
            <option value="false">Unpaid</option>
          </select>
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
              setPaymentType('');
              setPaid('');
            }}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </div>
      ) : isError ? (
        <div className="text-red-500">Error loading transactions.</div>
      ) : (
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={`${tx.TransactionID}`}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="text-blue-600 text-sm underline cursor-pointer"
                    onClick={() => handleOpenModal(tx.medicalHistoryId)}
                  >
                    MedicalHistory ID: {tx.medicalHistoryId}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    {getIcon(tx.paymentType)}
                    {formatPaymentType(tx.paymentType)}
                  </div>
                  <div className={`text-sm font-medium ${tx.paid ? 'text-green-600' : 'text-red-500'}`}>
                    {tx.paid ? 'Paid' : 'Unpaid'}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {tx.paidDate ? format(new Date(tx.paidDate), 'dd/MM/yyyy') : 'N/A'}
                  </div>
                </div>
              </div>
            ))}

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              </div>
            )}
          </div>
        </InfiniteScroll>
      )}

      {selectedMedicalHistoryId && isModalOpen && (
        <MedicalHistoryDetailModal
          medicalHistoryId={selectedMedicalHistoryId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
