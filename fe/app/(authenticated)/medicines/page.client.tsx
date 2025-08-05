"use client";

import {
  Pill,
  Activity,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import MedicineDeleteModal from "@/components/new/forms/medicines/MedicineDeleteModal";
import MedicineDetailModal from "@/components/new/forms/medicines/MedicineDetailModal";
import MedicineEditModal from "@/components/new/forms/medicines/MedicineEditModal";
// import { useEditMedicine } from "@/hooks/medicines/useEditMedicine";
import { useInfiniteMedicines } from "@/hooks/medicines/useMedicines";
import { Medicine } from "@/types/medicines";

// Format currency helper
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount
  );

function MedicinePageContent() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>(undefined);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteMedicines(5);

  // const { remove } = useEditMedicine();

  const meds: Medicine[] = data?.pages.flatMap((page) => page.data || []) || [];

  // Handlers
  const openDetail = (id: number) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };
  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedId(null);
  };

  const openCreate = () => {
    setEditingId(undefined);
    setIsEditOpen(true);
  };
  const openEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setEditingId(id);
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditingId(undefined);
  };

  const openDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => {
    setIsDeleteOpen(false);
    setDeletingId(null);
  };

  const onEditSuccess = () => {
    refetch();
  };
  const onDeleteSuccess = async () => {
    closeDelete();
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
        <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center">
          <Loader2 className="mx-auto size-12 animate-spin text-green-600" />
          <p className="ml-4 text-lg font-medium text-green-600">
            Loading medicines...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
        <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center">
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-lg">
            <AlertCircle className="mx-auto mb-4 size-12 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">
              Unable to load medicines
            </h3>
            <p className="text-gray-600">
              Something went wrong while fetching medicines.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="border-b border-green-100 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-green-600 p-3">
              <Pill className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Medicines</h1>
              <p className="mt-1 text-gray-600">
                Manage your medicine inventory
              </p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700 hover:shadow-lg"
          >
            <Plus className="size-5" />
            Add Medicine
          </button>
        </div>
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-green-500" />
            <span>{meds.length} items available</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-blue-500" />
            <span>Real-time stock updates</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl p-6">
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meds.map((med, idx) => (
              <div
                key={med.medicineID || idx}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                onClick={() => openDetail(med.medicineID)}
              >
                <div className="p-6">
                  <div className="mb-2 font-semibold">ID: {med.medicineID}</div>
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-green-600">
                    {med.medicineName}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {med.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(Number(med.unitPrice))}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Quantity: {med.quantity}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={(e) => openEdit(e, med.medicineID)}
                      className="rounded-lg p-2 transition-colors hover:bg-yellow-100"
                    >
                      <Edit className="size-4 text-yellow-600" />
                    </button>
                    <button
                      onClick={(e) => openDelete(e, med.medicineID)}
                      className="rounded-lg p-2 transition-colors hover:bg-red-100"
                    >
                      <Trash2 className="size-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="h-1 origin-left scale-x-0 bg-gradient-to-r from-green-500 to-blue-500 transition-transform duration-300 group-hover:scale-x-100"></div>
              </div>
            ))}
          </div>

          {/* Loading more */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-lg">
                <Loader2 className="size-6 animate-spin text-green-600" />
                <span className="font-medium text-green-600">
                  Loading more medicines...
                </span>
              </div>
            </div>
          )}
        </InfiniteScroll>

        {/* Finished */}
        {!hasNextPage && meds.length > 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-lg">
              <Activity className="mx-auto mb-4 size-12 text-green-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                All Medicines Loaded
              </h3>
              <p className="text-gray-600">
                You&apos;ve viewed all available medicines.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {meds.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-12 shadow-lg">
              <Pill className="mx-auto mb-6 size-16 text-gray-400" />
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                No Medicines Available
              </h3>
              <p className="mb-6 text-gray-600">
                Medicines will appear here when added.
              </p>
              <button
                onClick={openCreate}
                className="mx-auto flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white transition-all duration-200 hover:bg-green-700"
              >
                <Plus className="size-5" />
                Add First Medicine
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MedicineDetailModal
        medicineId={selectedId}
        isOpen={isDetailOpen}
        onClose={closeDetail}
      />
      <MedicineEditModal
        medicineId={editingId}
        isOpen={isEditOpen}
        onClose={closeEdit}
        onSuccess={onEditSuccess}
      />
      <MedicineDeleteModal
        medicineId={deletingId}
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onSuccess={onDeleteSuccess}
      />
    </>
  );
}

export default function MedicinePageClient() {
  return <MedicinePageContent />;
}
