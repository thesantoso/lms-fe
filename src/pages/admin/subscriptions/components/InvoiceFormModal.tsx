import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { mockPlans, mockSchoolOptions } from '@/data/subscriptions';
import type { SubscriptionInvoice, InvoiceStatus } from '@/data/subscriptions';

interface InvoiceFormModalProps {
  mode: 'create' | 'edit';
  invoice: SubscriptionInvoice | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: Omit<SubscriptionInvoice, 'id'> & { id?: string }) => void;
}

const InvoiceFormModal: React.FC<InvoiceFormModalProps> = ({ mode, invoice, loading, onClose, onSave }) => {
  const [form, setForm] = useState({
    invoiceNumber: invoice?.invoiceNumber || '',
    schoolName: invoice?.schoolName || '',
    planName: invoice?.planName || '',
    amount: invoice?.amount.toString() || '',
    issuedAt: invoice?.issuedAt || '',
    dueAt: invoice?.dueAt || '',
    status: invoice?.status || 'unpaid',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.invoiceNumber.trim()) errs.invoiceNumber = 'Nomor invoice wajib diisi.';
    if (!form.schoolName) errs.schoolName = 'Sekolah wajib dipilih.';
    if (!form.planName) errs.planName = 'Paket wajib dipilih.';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Jumlah wajib diisi lebih dari 0.';
    if (!form.issuedAt) errs.issuedAt = 'Tanggal terbit wajib diisi.';
    if (!form.dueAt) errs.dueAt = 'Jatuh tempo wajib diisi.';
    if (form.issuedAt && form.dueAt && form.dueAt < form.issuedAt) {
      errs.dueAt = 'Jatuh tempo tidak boleh sebelum tanggal terbit.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: invoice?.id,
      invoiceNumber: form.invoiceNumber.trim(),
      schoolName: form.schoolName,
      planName: form.planName,
      amount: Number(form.amount),
      issuedAt: form.issuedAt,
      dueAt: form.dueAt,
      status: form.status as InvoiceStatus,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Tagihan' : 'Edit Tagihan'}
      subtitle="Catat tagihan berlangganan yang diterbitkan ke sekolah"
      size="md"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="No. Invoice *"
            placeholder="cth: INV-2026-0006"
            value={form.invoiceNumber}
            error={errors.invoiceNumber}
            onChange={(e) => set('invoiceNumber', e.target.value)}
          />
          <Input
            label="Jumlah (Rp) *"
            type="number"
            placeholder="cth: 1250000"
            value={form.amount}
            error={errors.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Sekolah <span className="text-red-500">*</span>
          </label>
          <Select
            options={[{ value: '', label: 'Pilih sekolah...' }, ...mockSchoolOptions.map((s) => ({ value: s, label: s }))]}
            value={form.schoolName}
            onChange={(e) => set('schoolName', e.target.value)}
            className="w-full"
            error={errors.schoolName}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Paket Langganan <span className="text-red-500">*</span>
          </label>
          <Select
            options={[{ value: '', label: 'Pilih paket...' }, ...mockPlans.map((p) => ({ value: p.name, label: p.name }))]}
            value={form.planName}
            onChange={(e) => set('planName', e.target.value)}
            className="w-full"
            error={errors.planName}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Tanggal Terbit *"
            type="date"
            value={form.issuedAt}
            error={errors.issuedAt}
            onChange={(e) => set('issuedAt', e.target.value)}
          />
          <Input
            label="Jatuh Tempo *"
            type="date"
            value={form.dueAt}
            error={errors.dueAt}
            onChange={(e) => set('dueAt', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Status Pembayaran
          </label>
          <Select
            options={[
              { value: 'paid', label: 'Lunas' },
              { value: 'unpaid', label: 'Belum Dibayar' },
              { value: 'overdue', label: 'Terlambat' },
            ]}
            value={form.status}
            onChange={(e) => set('status', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-neutral-100 flex justify-end gap-3">
        <Button variant="ghost" className="text-neutral-600 px-6" onClick={onClose}>
          Batal
        </Button>
        <Button
          className="bg-[#1854F6] hover:bg-[#0C3FD6] text-white px-6"
          isLoading={loading}
          disabled={loading}
          onClick={handleSave}
        >
          Simpan
        </Button>
      </div>
    </Modal>
  );
};

export default InvoiceFormModal;