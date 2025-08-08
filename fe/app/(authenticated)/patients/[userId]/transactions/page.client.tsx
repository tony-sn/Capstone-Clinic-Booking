"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Banknote,
  Loader2,
  Receipt,
} from "lucide-react";
import { useState, useMemo } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import MedicalHistoryDetailModal from "@/components/new/forms/medical-history/medicalhistoryDetailForm";
import { usePatientMedicalHistories } from "@/hooks/medicalhistories/useMedicalhistories";
import { useInfiniteTransactions } from "@/hooks/transaction/useTransaction";
import { formatPaymentType } from "@/lib/utils";
import { PaymentType } from "@/types/transaction";

interface PatientTransactionsClientProps {
  userId: string;
}

function PatientTransactionsContent({
  userId,
}: PatientTransactionsClientProps) {
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

  // Get patient's medical histories to extract medicalHistoryIds
  const {
    data: medicalHistoriesData,
    isLoading: isLoadingMedicalHistories,
    isError: isMedicalHistoriesError,
  } = usePatientMedicalHistories({
    patientId: parseInt(userId),
    pageSize: 100, // Get all medical histories for this patient
  });

  // Extract medicalHistoryIds for filtering transactions
  const patientMedicalHistoryIds = useMemo(() => {
    if (!medicalHistoriesData?.data) return [];
    return medicalHistoriesData.data.map((history) => history.id);
  }, [medicalHistoriesData]);

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError: isTransactionsError,
  } = useInfiniteTransactions({
    fromDate,
    toDate,
    paymentType: paymentType || undefined,
    paid: paid === "" ? undefined : paid === "true",
  });

  // Filter transactions to only show those belonging to this patient's medical histories
  const patientTransactions = useMemo(() => {
    if (!transactionsData?.pages || patientMedicalHistoryIds.length === 0) {
      return [];
    }

    return transactionsData.pages
      .flatMap((page) => page.data || [])
      .filter((transaction) =>
        patientMedicalHistoryIds.includes(transaction.medicalHistoryId)
      );
  }, [transactionsData, patientMedicalHistoryIds]);

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

  const isLoading = isLoadingMedicalHistories || isLoadingTransactions;
  const isError = isMedicalHistoriesError || isTransactionsError;

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-green-600" />
          <span className="ml-2">Loading your transactions...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-lg border bg-card p-6 text-center">
          <p className="text-red-500">
            Error loading your transaction data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Receipt className="size-8 text-green-600" />
            My Transactions
          </h1>
          <p className="text-muted-foreground">
            View your payment history and transaction records
          </p>
        </div>

        {/* Filters */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Filter Transactions</h2>
          <div className="flex flex-wrap items-end gap-4">
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
                Status
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
        </div>

        {/* Transactions List */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Payment History</h2>
              <div className="text-sm text-muted-foreground">
                {patientTransactions.length} transaction(s) found
              </div>
            </div>

            <div className="mt-6">
              {patientTransactions.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  {patientMedicalHistoryIds.length === 0 ? (
                    <>
                      No medical history found.
                      <br />
                      You need to have medical appointments to see transactions.
                    </>
                  ) : (
                    <>
                      No transactions found matching your criteria.
                      <br />
                      Try adjusting your filters or check back later.
                    </>
                  )}
                </div>
              ) : (
                <InfiniteScroll
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                >
                  <div className="space-y-4">
                    {patientTransactions.map((tx) => (
                      <div
                        key={`${tx.TransactionID}`}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="cursor-pointer text-sm text-blue-600 underline hover:text-blue-800"
                            onClick={() => handleOpenModal(tx.medicalHistoryId)}
                            title="Click to view medical history details"
                          >
                            Medical History #{tx.medicalHistoryId}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-700">
                            {getIcon(tx.paymentType)}
                            {formatPaymentType(tx.paymentType)}
                          </div>
                          <div
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              tx.paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tx.paid ? "Paid" : "Unpaid"}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <CalendarIcon className="size-4" />
                            {tx.paidDate
                              ? format(new Date(tx.paidDate), "MMM dd, yyyy")
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
            </div>
          </div>
        </div>
      </div>

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

export default function PatientTransactionsClient({
  userId,
}: PatientTransactionsClientProps) {
  return <PatientTransactionsContent userId={userId} />;
}
