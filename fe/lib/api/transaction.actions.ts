"use server";

import { Endpoints } from "@/lib/app.config";
import type { TransactionFilter, TransactionResponse } from "@/types/transaction";

export const getTransactions = async (filter: TransactionFilter): Promise<TransactionResponse> => {
  const params = new URLSearchParams();
  if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());
  if (filter.pageNumber) params.append("pageNumber", filter.pageNumber.toString());
  if (filter.fromDate) params.append("fromDate", filter.fromDate);
  if (filter.toDate) params.append("toDate", filter.toDate);
  if (filter.paymentType) params.append("paymentType", filter.paymentType);
  if (typeof filter.paid === "boolean") params.append("paid", filter.paid.toString());

  const res = await fetch(`${Endpoints.TRANSACTION}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return res.json();
};
