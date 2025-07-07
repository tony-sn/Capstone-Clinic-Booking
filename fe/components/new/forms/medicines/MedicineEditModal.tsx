import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEditMedicine } from '@/hooks/medicines/useEditMedicine';
import { MedicineRequest } from '@/types/medicines';
import { getMedicineById } from '@/lib/api/medicine.actions';

interface Props {
  medicineId?: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MedicineEditModal({ medicineId, isOpen, onClose, onSuccess }: Props) {
  const { create, update } = useEditMedicine();
  const [form, setForm] = useState<MedicineRequest>({ medicineName: '', description: '', quantity: 0, unitPrice: 0 });

  useEffect(() => {
    if (medicineId && isOpen) {
      getMedicineById(medicineId).then(res => setForm({
        medicineName: res.data.medicineName,
        description: res.data.description,
        quantity: res.data.quantity,
        unitPrice: res.data.unitPrice,
      }));
    }
  }, [medicineId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value }));
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append('MedicineName', form.medicineName);
    fd.append('Description', form.description);
    fd.append('Quantity', form.quantity.toString());
    fd.append('UnitPrice', form.unitPrice.toString());

    try {
      if (medicineId) await update.mutateAsync({ id: medicineId, formData: fd });
      else await create.mutateAsync(fd);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{medicineId ? 'Edit' : 'Create'} Medicine</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="medicineName" value={form.medicineName} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit Price</label>
            <input type="number" name="unitPrice" value={form.unitPrice} onChange={handleChange} className="w-full border rounded px-2 py-1" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{medicineId ? 'Update' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
