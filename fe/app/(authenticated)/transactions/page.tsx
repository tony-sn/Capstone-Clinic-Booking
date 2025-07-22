"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Banknote,
  Loader2,
  Filter,
} from "lucide-react";
import { useState } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import MedicalHistoryDetailModal from "@/components/new/forms/medical-history/medicalhistoryDetailForm";
import { useInfiniteTransactions } from "@/hooks/transaction/useTransaction";
import { formatPaymentType } from "@/lib/utils";
import { PaymentType } from "@/types/transaction";

export default function TransactionPage() {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [paid, setPaid] = useState<string>(""); // '' | 'true' | 'false'

  const [selectedMedicalHistoryId, setSelectedMedicalHistoryId] = useState<
    number | null
  >(null);
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
    paid: paid === "" ? undefined : paid === "true",
  });

  const transactions = data?.pages.flatMap((p) => p.data || []) || [];

  const getIcon = (type: number | string) => {
    const label = formatPaymentType(type);
    if (label === "Cash")
      return <DollarSign className="size-4 text-green-600" />;
    if (label === "Card")
      return <CreditCard className="size-4 text-blue-600" />;
    if (label === "Bank Transfer")
      return <Banknote className="size-4 text-yellow-600" />;
    return null;
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 flex items-center gap-2 text-2xl font-bold">
        <Filter className="size-5 text-gray-500" />
        Transaction Records
      </h1>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Type
          </label>
          <select
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value as PaymentType)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="BankTransfer">Bank Transfer</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Paid
          </label>
          <select
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2"
          >
            <option value="">All</option>
            <option value="true">Paid</option>
            <option value="false">Unpaid</option>
          </select>
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              setFromDate("");
              setToDate("");
              setPaymentType("");
              setPaid("");
            }}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-green-600" />
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
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="cursor-pointer text-sm text-blue-600 underline"
                    onClick={() => handleOpenModal(tx.medicalHistoryId)}
                  >
                    MedicalHistory ID: {tx.medicalHistoryId}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    {getIcon(tx.paymentType)}
                    {formatPaymentType(tx.paymentType)}
                  </div>
                  <div
                    className={`text-sm font-medium ${tx.paid ? "text-green-600" : "text-red-500"}`}
                  >
                    {tx.paid ? "Paid" : "Unpaid"}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <CalendarIcon className="size-4" />
                    {tx.paidDate
                      ? format(new Date(tx.paidDate), "dd/MM/yyyy")
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="size-5 animate-spin text-green-600" />
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
