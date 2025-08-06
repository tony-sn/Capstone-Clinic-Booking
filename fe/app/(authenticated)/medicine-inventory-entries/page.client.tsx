"use client";

import {
  AlertCircle,
  ArrowUpDown,
  Building2,
  FileText,
  Package,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { useMedicineInventoryEntries } from "@/hooks/medicine-inventory-entries/useMedicineInventoryEntries";
import { MedicineInventoryEntry } from "@/types/medicines";

export default function MedicineInventoryEntryPageContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: entries = [],
    isLoading,
    refetch,
    error,
  } = useMedicineInventoryEntries({
    pageSize: 100,
    pageNumber: 1,
  });

  const filteredEntries = useMemo(() => {
    const entryList = Array.isArray(entries) ? entries : (entries?.data ?? []);

    if (!searchQuery.trim()) return entryList;

    const query = searchQuery.toLowerCase().trim();
    return entryList.filter(
      (entry) =>
        entry.companyName.toLowerCase().includes(query) ||
        entry.note.toLowerCase().includes(query) ||
        entry.id.toString().includes(query)
    );
  }, [entries, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const getChangeTypeLabel = (changeType: number) => {
    return changeType === 0 ? "Inbound" : "Outbound";
  };

  const getChangeTypeColor = (changeType: number) => {
    return changeType === 0 ? "text-green-600" : "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 animate-spin text-blue-500">
            <Package className="size-10" />
          </div>
          <p className="text-gray-600">Loading inventory entries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
          <p className="mb-4 text-gray-700">Failed to load inventory entries.</p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white"
          >
            <RotateCcw className="size-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-blue-600 p-3">
                <Package className="size-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Medicine Inventory Entries</h1>
                <p className="text-gray-600">
                  Track all medicine inventory movements and transactions
                </p>
              </div>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="size-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by company name, note, or entry ID..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-12 py-3 text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <X className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {filteredEntries.map((entry: MedicineInventoryEntry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between rounded-xl bg-white p-6 shadow-md hover:shadow-lg"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Entry #{entry.id}
                  </h2>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                    entry.changeType === 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <ArrowUpDown className="size-3" />
                    {getChangeTypeLabel(entry.changeType)}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="size-4" />
                    Company: {entry.companyName}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="size-4" />
                    Medicine ID: {entry.medicineID}
                  </div>
                  <div className="text-sm text-gray-600">
                    Quantity: <span className={`font-medium ${getChangeTypeColor(entry.changeType)}`}>
                      {entry.changeType === 0 ? '+' : '-'}{entry.quantity}
                    </span>
                  </div>
                  {entry.prescriptionID && (
                    <div className="text-sm text-gray-600">
                      Prescription ID: {entry.prescriptionID}
                    </div>
                  )}
                </div>
                {entry.note && (
                  <div className="mt-2 text-sm text-gray-500">
                    <strong>Note:</strong> {entry.note}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="py-16 text-center text-gray-600">
              <Search className="mx-auto mb-4 size-12 text-gray-400" />
              No inventory entries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
