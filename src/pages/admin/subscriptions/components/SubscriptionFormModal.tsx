import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { mockPlans, mockSchoolOptions } from '@/data/subscriptions';
import type { ActiveSubscription, ActiveSubscriptionStatus } from '@/data/subscriptions';

interface SubscriptionFormModalProps {
  mode: 'create' | 'edit';
  subscription: ActiveSubscription | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: Omit<ActiveSubscription, 'id'> & { id?: string }) => void;
}

const SubscriptionFormModal: React.FC<SubscriptionFormModalProps> = ({
  mode,
  subscription,
  loading,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    schoolName: subscription?.schoolName || '',
    planName: subscription?.planName || '',
    startDate: subscription?.startDate || '',
    endDate: subscription?.endDate || '',
    status: subscription?.status || 'active',
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
    if (!form.schoolName) errs.schoolName = 'Sekolah wajib dipilih.';
    if (!form.planName) errs.planName = 'Paket wajib dipilih.';
    if (!form.startDate) errs.startDate = 'Tanggal mulai wajib diisi.';
    if (!form.endDate) errs.endDate = 'Tanggal berakhir wajib diisi.';
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = 'Tanggal berakhir tidak boleh sebelum tanggal mulai.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: subscription?.id,
      schoolName: form.schoolName,
      planName: form.planName,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status as ActiveSubscriptionStatus,
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Langganan' : 'Edit Langganan'}
      subtitle="Tetapkan paket dan periode berlangganan untuk sekolah"
      size="md"
    >
      <div className="space-y-6">
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
            label="Tanggal Mulai *"
            type="date"
            value={form.startDate}
            error={errors.startDate}
            onChange={(e) => set('startDate', e.target.value)}
          />
          <Input
            label="Tanggal Berakhir *"
            type="date"
            value={form.endDate}
            error={errors.endDate}
            onChange={(e) => set('endDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Status
          </label>
          <Select
            options={[
              { value: 'active', label: 'Aktif' },
              { value: 'expiring', label: 'Segera Berakhir' },
              { value: 'expired', label: 'Berakhir' },
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

export default SubscriptionFormModal;