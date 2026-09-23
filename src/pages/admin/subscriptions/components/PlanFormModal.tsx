import React, { useMemo, useState } from 'react';
import { Check, Eye } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { SubscriptionPlan } from '@/data/subscriptions';

interface PlanFormModalProps {
  mode: 'create' | 'edit';
  plan: SubscriptionPlan | null;
  loading?: boolean;
  onClose: () => void;
  onSave: (data: Omit<SubscriptionPlan, 'id'> & { id?: string }) => void;
}

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const PlanFormModal: React.FC<PlanFormModalProps> = ({ mode, plan, loading, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: plan?.name || '',
    code: plan?.code || '',
    price: plan?.price.toString() || '',
    durationMonths: plan?.durationMonths.toString() || '',
    features: plan?.features.join(', ') || '',
    status: plan?.status || 'active',
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

  const preview = useMemo(() => {
    const price = Number(form.price) || 0;
    const duration = Number(form.durationMonths) || 0;
    const features = form.features
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
    return {
      code: form.code.trim().toUpperCase() || 'KODE',
      name: form.name.trim() || 'Nama Paket',
      price,
      duration,
      monthly: duration > 0 ? Math.round(price / duration) : 0,
      features,
      status: form.status,
    };
  }, [form]);

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nama paket wajib diisi.';
    if (!form.code.trim()) errs.code = 'Kode paket wajib diisi.';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Harga wajib diisi lebih dari 0.';
    if (!form.durationMonths) errs.durationMonths = 'Durasi wajib dipilih.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: plan?.id,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      price: Number(form.price),
      durationMonths: Number(form.durationMonths),
      features: form.features
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      status: form.status as SubscriptionPlan['status'],
    });
  };

  const isActive = preview.status === 'active';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Paket Langganan' : 'Edit Paket Langganan'}
      subtitle="Atur nama, harga, dan fitur yang tersedia di paket"
      size="lg"
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nama Paket *"
              placeholder="cth: Paket Standar"
              value={form.name}
              error={errors.name}
              onChange={(e) => set('name', e.target.value)}
            />
            <Input
              label="Kode Paket *"
              placeholder="cth: STD"
              value={form.code}
              error={errors.code}
              onChange={(e) => set('code', e.target.value)}
            />
            <Input
              label="Harga (Rp) *"
              type="number"
              placeholder="cth: 1250000"
              value={form.price}
              error={errors.price}
              onChange={(e) => set('price', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Durasi <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih durasi...' },
                  { value: '1', label: '1 Bulan' },
                  { value: '3', label: '3 Bulan' },
                  { value: '6', label: '6 Bulan' },
                  { value: '12', label: '12 Bulan' },
                ]}
                value={form.durationMonths}
                onChange={(e) => set('durationMonths', e.target.value)}
                className="w-full"
                error={errors.durationMonths}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Fitur Paket
            </label>
            <textarea
              placeholder="Pisahkan dengan koma, cth: Guru 50, Siswa 500, Laporan bulanan"
              value={form.features}
              onChange={(e) => set('features', e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-neutral-300 bg-white text-neutral-900 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-xs text-neutral-500 mt-1">
              {preview.features.length} fitur — setiap baris dipisahkan tanda koma.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <Select
              options={[
                { value: 'active', label: 'Aktif' },
                { value: 'inactive', label: 'Tidak Aktif' },
              ]}
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Live preview */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-0 bg-neutral-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-3">
              <Eye size={18} className="text-neutral-400" />
              Pratinjau Kartu
            </div>
            <div className="flex flex-col rounded-xl border border-neutral-200 overflow-hidden bg-white">
              <div className={isActive ? 'px-4 pt-4 pb-5 bg-blue-600 text-white' : 'px-4 pt-4 pb-5 bg-neutral-400 text-white'}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-90">{preview.code}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white">
                    {isActive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                <h4 className="font-bold mt-2.5">{preview.name}</h4>
                <div className="mt-2.5 text-xl font-extrabold tracking-tight">{formatRupiah(preview.price)}</div>
                <p className="text-[11px] mt-0.5 opacity-90">
                  {preview.duration > 0 ? `${preview.duration} bulan · ${formatRupiah(preview.monthly)}/bulan` : '—'}
                </p>
              </div>
              <div className="px-4 py-4">
                {preview.features.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">Belum ada fitur ditambahkan</p>
                ) : (
                  <ul className="space-y-2">
                    {preview.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-neutral-600">
                        <span className="mt-0.5 w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center bg-blue-50 text-blue-600">
                          <Check size={8} weight="bold" />
                        </span>
                        {f}
                      </li>
                    ))}
                    {preview.features.length > 4 && (
                      <li className="text-xs text-neutral-400 pl-5">
                        +{preview.features.length - 4} fitur lainnya
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
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

export default PlanFormModal;