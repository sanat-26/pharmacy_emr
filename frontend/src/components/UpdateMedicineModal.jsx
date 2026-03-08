import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { toast } from 'react-hot-toast';
import { api } from '../services/api';

export default function UpdateMedicineModal({ isOpen, onClose, onSuccess, initialData }) {
  const [medicineForm, setMedicineForm] = useState({
    name: '', generic_name: '', category: '', batch_no: '', expiry_date: '', quantity: 0, cost_price: 0, mrp: 0, supplier: '', status: 'Active'
  });

  useEffect(() => {
    if (initialData) {
      setMedicineForm(initialData);
    }
  }, [initialData]);

  const handleMedicineSubmit = async (e) => {
    e.preventDefault();
    try {
      // Determine status based on quantity
      let updatedStatus = medicineForm.status;
      if (medicineForm.quantity === 0) {
        updatedStatus = 'Out of Stock';
      } else if (medicineForm.quantity <= 10) {
        updatedStatus = 'Low Stock';
      } else {
        updatedStatus = 'Active';
      }

      const payload = {
        ...medicineForm,
        status: updatedStatus
      };

      await api.put(`/inventory/medicines/${initialData.id}`, payload);
      if (onSuccess) onSuccess();
      toast.success("Medicine updated successfully!");
      onClose();
    } catch (err) {
      toast.error("Failed to update medicine.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Update Medicine: ${initialData?.name || ''}`}>
      <form onSubmit={handleMedicineSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
              <input required type="text" value={medicineForm.name} onChange={e => setMedicineForm({...medicineForm, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Generic Name</label>
              <input required type="text" value={medicineForm.generic_name} onChange={e => setMedicineForm({...medicineForm, generic_name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Batch No</label>
              <input required type="text" value={medicineForm.batch_no} onChange={e => setMedicineForm({...medicineForm, batch_no: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
              <input required type="date" value={medicineForm.expiry_date} onChange={e => setMedicineForm({...medicineForm, expiry_date: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
              <input required type="number" min="0" value={medicineForm.quantity || ''} onChange={e => setMedicineForm({...medicineForm, quantity: e.target.value ? parseInt(e.target.value) : 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <input required type="text" value={medicineForm.category} onChange={e => setMedicineForm({...medicineForm, category: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50" readOnly />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Cost Price</label>
              <input required step="0.01" min="0" type="number" value={medicineForm.cost_price || ''} onChange={e => setMedicineForm({...medicineForm, cost_price: e.target.value ? parseFloat(e.target.value) : 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">MRP</label>
              <input required step="0.01" min="0" type="number" value={medicineForm.mrp || ''} onChange={e => setMedicineForm({...medicineForm, mrp: e.target.value ? parseFloat(e.target.value) : 0})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
           </div>
           <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Supplier</label>
              <input required type="text" value={medicineForm.supplier} onChange={e => setMedicineForm({...medicineForm, supplier: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
           </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="button" variant="outline" className="mr-2" onClick={onClose}>Cancel</Button>
          <Button type="submit">Update Medicine</Button>
        </div>
      </form>
    </Modal>
  );
}
