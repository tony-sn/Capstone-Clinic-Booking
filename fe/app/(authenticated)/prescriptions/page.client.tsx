"use client";

import { Loader2, Stethoscope, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

import InfiniteScroll from "@/components/InfiniteScroll";
import PrescriptionDeleteModal from "@/components/new/forms/prescriptions/PrescriptionDeleteModal";
import PrescriptionDetailModal from "@/components/new/forms/prescriptions/PrescriptionDetailModal";
import PrescriptionEditModal from "@/components/new/forms/prescriptions/PrescriptionEditModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInfinitePrescriptions } from "@/hooks/prescriptions/usePrescriptions";
import { useToast } from "@/hooks/use-toast";
import { flattenPages } from "@/lib/utils";

function PrescriptionPageContent() {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [medicalHistoryId, setMedicalHistoryId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfinitePrescriptions(5);

  //eslint-disable-next-line
  const prescriptions = flattenPages<any>(data?.pages || []);

  const openDetail = ({
    prescriptionId,
    medicalHistoryId,
  }: {
    prescriptionId: number;
    medicalHistoryId: number;
  }) => {
    setSelectedId(prescriptionId);
    setMedicalHistoryId(medicalHistoryId);
    setIsDetailOpen(true);
  };
  const closeDetail = () => setIsDetailOpen(false);
  const openCreate = () => {
    setEditingId(null);
    setIsEditOpen(true);
  };

  const openEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setEditingId(id);
    setIsEditOpen(true);
  };
  const closeEdit = () => setIsEditOpen(false);

  const openDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setDeletingId(id);
    setIsDeleteOpen(true);
  };
  const closeDelete = () => setIsDeleteOpen(false);

  const onEditSuccess = () => {
    toast({
      title: "Create/Edit Prescription",
      description: "Prescription updated successfully!",
      duration: 3000,
    });
    refetch();
  };
  const onDeleteSuccess = async () => {
    closeDelete();
    await refetch();
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-600 p-3">
            <Stethoscope className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>
            <p className="mt-1 text-gray-600">
              Review and manage all prescriptions
            </p>
          </div>
        </div>
        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={openCreate}
        >
          <Plus className="size-5" />
          Add Prescription
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="mr-2 size-6 animate-spin text-blue-600" /> Loading
          prescriptions...
        </div>
      )}

      {isError && <p className="text-red-500">Error loading prescriptions.</p>}

      <InfiniteScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prescriptions.map((prescription, index) => (
            <Card
              key={prescription.prescriptionID || index}
              onClick={() =>
                openDetail({
                  prescriptionId: prescription.prescriptionID,
                  medicalHistoryId: prescription.medicalHistoryID,
                })
              }
              className="cursor-pointer transition-shadow hover:shadow-xl"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Prescription #{prescription.prescriptionID}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-gray-600">
                <div>
                  <strong>Medical History ID:</strong>{" "}
                  {prescription.medicalHistoryID}
                </div>
                <div>
                  <strong>Total Amount:</strong> ${prescription.totalAmount}
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-yellow-100"
                    onClick={(e) => openEdit(e, prescription.prescriptionID)}
                  >
                    <Edit className="size-4 text-yellow-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-100"
                    onClick={(e) => openDelete(e, prescription.prescriptionID)}
                  >
                    <Trash2 className="size-4 text-red-600" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </InfiniteScroll>

      <PrescriptionDetailModal
        prescriptionId={selectedId}
        medicalHistoryId={medicalHistoryId as number}
        isOpen={isDetailOpen}
        onClose={closeDetail}
      />

      <PrescriptionEditModal
        prescriptionId={editingId}
        isOpen={isEditOpen}
        onClose={closeEdit}
        onSuccess={onEditSuccess}
      />

      <PrescriptionDeleteModal
        prescriptionId={deletingId}
        isOpen={isDeleteOpen}
        onClose={closeDelete}
        onSuccess={onDeleteSuccess}
      />
    </div>
  );
}

export default function PrescriptionPageClient() {
  return <PrescriptionPageContent />;
}
