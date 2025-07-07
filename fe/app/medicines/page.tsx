'use client';

import React, { useState } from 'react';
import {
  Pill,
  Activity,
  Clock,
  Loader2,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react';
import InfiniteScroll from '@/components/InfiniteScroll';
import { useInfiniteMedicines } from '@/hooks/medicines/useMedicines';
import { useEditMedicine } from '@/hooks/medicines/useEditMedicine';
import { Medicine } from '@/types/medicines';
import MedicineDetailModal from '@/components/new/forms/medicines/MedicineDetailModal';
import MedicineEditModal   from '@/components/new/forms/medicines/MedicineEditModal';
import MedicineDeleteModal from '@/components/new/forms/medicines/MedicineDeleteModal';

// Format currency helper
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function MedicinePage() {
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

  const { remove } = useEditMedicine();

  const meds: Medicine[] = data?.pages.flatMap(page => page.data || []) || [];

  // Handlers
  const openDetail = (id: number) => { setSelectedId(id); setIsDetailOpen(true); };
  const closeDetail = () => { setIsDetailOpen(false); setSelectedId(null); };

  const openCreate = () => { setEditingId(undefined); setIsEditOpen(true); };
  const openEdit = (e: React.MouseEvent, id: number) => { e.stopPropagation(); setEditingId(id); setIsEditOpen(true); };
  const closeEdit = () => { setIsEditOpen(false); setEditingId(undefined); };

  const openDelete = (e: React.MouseEvent, id: number) => { e.stopPropagation(); setDeletingId(id); setIsDeleteOpen(true); };
  const closeDelete = () => { setIsDeleteOpen(false); setDeletingId(null); };

  const onEditSuccess = () => { refetch(); };
  const onDeleteSuccess = async () => { closeDelete(); await refetch(); };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto" />
          <p className="text-lg text-green-600 font-medium ml-4">Loading medicines...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to load medicines</h3>
            <p className="text-gray-600">Something went wrong while fetching medicines.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-xl">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Medicines</h1>
              <p className="text-gray-600 mt-1">Manage your medicine inventory</p>
            </div>
          </div>
          <button
            onClick={openCreate}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            Add Medicine
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span>{meds.length} items available</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Real-time stock updates</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <InfiniteScroll
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meds.map((med, idx) => (
              <div
                key={med.medicineID || idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer"
                onClick={() => openDetail(med.medicineID)}
              >
                <div className="p-6">
                  <div className="font-semibold mb-2">ID: {med.medicineID}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {med.medicineName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {med.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(Number(med.unitPrice))}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">Quantity: {med.quantity}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => openEdit(e, med.medicineID)}
                      className="p-2 hover:bg-yellow-100 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4 text-yellow-600" />
                    </button>
                    <button
                      onClick={e => openDelete(e, med.medicineID)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            ))}
          </div>

          {/* Loading more */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                <span className="text-green-600 font-medium">Loading more medicines...</span>
              </div>
            </div>
          )}
        </InfiniteScroll>

        {/* Finished */}
        {!hasNextPage && meds.length > 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 mx-auto max-w-md">
              <Activity className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">All Medicines Loaded</h3>
              <p className="text-gray-600">You've viewed all available medicines.</p>
            </div>
          </div>
        )}

        {/* Empty */}
        {meds.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12 mx-auto max-w-md">
              <Pill className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No Medicines Available</h3>
              <p className="text-gray-600 mb-6">Medicines will appear here when added.</p>
              <button
                onClick={openCreate}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all duration-200"
              >
                <Plus className="h-5 w-5" />
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
