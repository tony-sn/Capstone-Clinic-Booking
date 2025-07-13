export type PaymentType = 'Cash' | 'Card' | 'BankTransfer';

export interface Transaction {
  TransactionID: number;
  medicalHistoryId: number;
  paymentType: PaymentType | number;
  paid: boolean;
  paidDate: string | null;
  active: boolean;
}

export interface TransactionResponse {
  data: Transaction[];
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalItems: number;
  };
}

export interface TransactionFilter {
  fromDate?: string;
  toDate?: string;
  paymentType?: PaymentType | "";
  paid?: boolean | "";
  pageSize?: number;
  pageNumber?: number;
}