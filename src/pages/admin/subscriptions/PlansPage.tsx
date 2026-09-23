import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Receipt,
  MagnifyingGlass,
  Trash,
  CaretRight,
  PencilSimple,
  Check,
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import PlanFormModal from './components/PlanFormModal';
import { mockPlans, mockActiveSubscriptions } from '@/data/subscriptions';
import type { SubscriptionPlan } from '@/data/subscriptions';
import { cn } from '@/lib/utils';

type ModalMode = 'create' | 'edit';

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

// Palette band header per paket. Hue dibatasi pada satu keluarga cool tone
// (biru/teal/indigo/slate) agar warna beda antar paket tetap berada dalam
// sistem warna brand aplikasi, bukan palet rainbow (R-29).
const planHues = [
  { band: 'bg-blue-600', chip: 'bg-blue-50 text-blue-700', cta: 'bg-[#2563EB] hover:bg-blue-700' },
  { band: 'bg-emerald-600', chip: 'bg-emerald-50 text-emerald-700', cta: 'bg-emerald-600 hover:bg-emerald-700' },
  { band: 'bg-indigo-600', chip: 'bg-indigo-50 text-indigo-700', cta: 'bg-indigo-600 hover:bg-indigo-700' },
  { band: 'bg-slate-700', chip: 'bg-slate-100 text-slate-700', cta: 'bg-slate-700 hover:bg-slate-800' },
];

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; plan: SubscriptionPlan | null }>({
    open: false,
    mode: 'create',
    plan: null,
  });
  const [deactivateConfirm, setDeactivateConfirm] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({
    open: false,
    plan: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({
    open: false,
    plan: null,
  });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(
    () =>
      plans.filter((p) => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? p.status === statusFilter : true;
        return matchesSearch && matchesStatus;
      }),
    [plans, searchTerm, statusFilter],
  );

  // Highlight paket yang paling banyak dipilih langganan aktif, dihitung dari
  // data (bukan dekorasi): ini sinyal adopsi realistis (R-31, C-5).
  const topPlanId = useMemo(() => {
    const counts = mockActiveSubscriptions
      .filter((s) => s.status !== 'expired')
      .reduce<Record<string, number>>((acc, s) => {
        acc[s.planName] = (acc[s.planName] || 0) + 1;
        return acc;
      }, {});
    const entries = Object.entries(counts).filter(([, n]) => n > 0);
    if (entries.length === 0) return undefined;
    entries.sort((a, b) => b[1] - a[1]);
    return plans.find((p) => p.name === entries[0][0])?.id;
  }, [plans]);

  const activeCount = plans.filter((p) => p.status === 'active').length;

  const openCreate = () => setModal({ open: true, mode: 'create', plan: null });
  const openEdit = (plan: SubscriptionPlan) => setModal({ open: true, mode: 'edit', plan });

  const handleSave = (data: Omit<SubscriptionPlan, 'id'> & { id?: string }) => {
    setSaving(true);
    try {
      if (data.id) {
        setPlans((prev) => prev.map((p) => (p.id === data.id ? { id: data.id, ...data } : p)));
      } else {
        const next: SubscriptionPlan = {
          ...data,
          id: `plan-${Date.now()}`,
          status: 'active',
        };
        setPlans((prev) => [next, ...prev]);
      }
      setModal((m) => ({ ...m, open: false }));
      setNotice(data.id ? 'Paket langganan berhasil diperbarui!' : 'Paket langganan berhasil dibuat!');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = (plan: SubscriptionPlan) => {
    if (plan.status === 'active') {
      setDeactivateConfirm({ open: true, plan });
      return;
    }
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: 'active' as const } : p)));
    setNotice('Paket langganan diaktifkan kembali!');
  };

  const executeDeactivate = () => {
    if (!deactivateConfirm.plan) return;
    const plan = deactivateConfirm.plan;
    setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, status: 'inactive' as const } : p)));
    setDeactivateConfirm({ open: false, plan: null });
    setNotice('Paket langganan dinonaktifkan.');
  };

  const executeDelete = () => {
    if (!deleteConfirm.plan) return;
    const plan = deleteConfirm.plan;
    setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    setDeleteConfirm({ open: false, plan: null });
    setNotice('Paket langganan berhasil dihapus!');
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Receipt size={28} className="text-neutral-500" />
          <h1 className="text-2xl font-bold text-neutral-600">Subscriptions</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
          <span className="hover:text-blue-600 cursor-pointer">Dasbor</span>
          <CaretRight size={12} className="mx-2" />
          <span className="hover:text-blue-600 cursor-pointer">Subscriptions</span>
          <CaretRight size={12} className="mx-2" />
          <span className="text-blue-600 font-medium">Paket Langganan</span>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
          {notice}
        </div>
      )}

      {/* Toolbar */}
      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Paket Langganan</h2>
              <p className="text-sm text-neutral-500 mt-0.5">
                {plans.length} paket · {activeCount} aktif
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="w-full sm:w-64">
                <Input
                  placeholder="Cari paket..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<MagnifyingGlass size={20} className="text-neutral-400" />}
                  className="h-10 border-neutral-300"
                />
              </div>
              <Select
                options={[
                  { value: '', label: 'Semua Status' },
                  { value: 'active', label: 'Aktif' },
                  { value: 'inactive', label: 'Tidak Aktif' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-40 h-10 rounded-lg border-neutral-300"
              />
              <Button
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 font-medium h-10 border-none"
                onClick={openCreate}
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Tambah Paket
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Plan cards */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      ) : filtered.length === 0 ? (
        <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
          <CardBody className="p-12 text-center">
            <p className="text-neutral-500 text-sm">
              {searchTerm || statusFilter
                ? 'Tidak ada paket yang cocok dengan pencarian'
                : 'Belum ada data paket'}
            </p>
            {searchTerm || statusFilter ? (
              <Button
                variant="ghost"
                className="mt-4 text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
              >
                Reset pencarian
              </Button>
            ) : (
              <Button
                className="mt-4 bg-[#2563EB] hover:bg-blue-700 text-white border-none"
                onClick={openCreate}
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Tambah Paket
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {filtered.map((plan, index) => {
            const hue = planHues[index % planHues.length];
            const monthly = Math.round(plan.price / plan.durationMonths);
            const isTop = topPlanId === plan.id;
            const isActive = plan.status === 'active';
            return (
              <div
                key={plan.id}
                className={cn(
                  'flex flex-col rounded-2xl border overflow-hidden bg-white transition-shadow',
                  isActive ? 'border-neutral-200 hover:shadow-lg hover:shadow-blue-600/5' : 'border-neutral-200',
                )}
              >
                {/* Header band */}
                <div className={cn('px-5 pt-5 pb-6 text-white', isActive ? hue.band : 'bg-neutral-400')}>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold tracking-widest uppercase opacity-90">{plan.code}</span>
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold',
                        isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700',
                      )}
                    >
                      {isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mt-3">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight">{formatRupiah(plan.price)}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-90">
                    {plan.durationMonths} bulan · {formatRupiah(monthly)}/bulan
                  </p>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-5 py-5">
                  <div className="min-h-[11rem]">
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-neutral-600">
                          <span
                            className={cn(
                              'mt-0.5 w-4 h-4 rounded-full shrink-0 flex items-center justify-center',
                              isActive ? hue.chip : 'bg-neutral-100 text-neutral-400',
                            )}
                          >
                            <Check size={10} weight="bold" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isTop && (
                      <span className="inline-flex items-center mt-4 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[11px] font-semibold">
                        Paling banyak dipilih
                      </span>
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col gap-2">
                    <Button
                      size="sm"
                      className={cn(
                        'h-10 w-full rounded-lg border-none text-white font-medium',
                        isActive ? hue.cta : 'bg-neutral-400 hover:bg-neutral-500',
                      )}
                      onClick={() => openEdit(plan)}
                    >
                      <PencilSimple size={16} weight="bold" className="mr-1.5" />
                      Edit Paket
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 flex-1 rounded-lg text-neutral-600 bg-neutral-50 hover:bg-neutral-100 text-xs font-medium"
                        onClick={() => toggleStatus(plan)}
                      >
                        {isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 w-10 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 justify-center"
                        onClick={() => setDeleteConfirm({ open: true, plan })}
                        aria-label={`Hapus ${plan.name}`}
                      >
                        <Trash size={16} weight="bold" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <PlanFormModal
          mode={modal.mode}
          plan={modal.plan}
          loading={saving}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
          onSave={handleSave}
        />
      )}

      {/* Deactivate confirm */}
      <Modal
        isOpen={deactivateConfirm.open}
        onClose={() => setDeactivateConfirm({ open: false, plan: null })}
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash size={32} weight="bold" className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Apakah Anda Yakin?</h3>
          <p className="text-neutral-500 text-sm mb-6">
            {deactivateConfirm.plan
              ? `Paket "${deactivateConfirm.plan.name}" akan dinonaktifkan dan tidak bisa dipilih saat berlangganan.`
              : 'Paket akan dinonaktifkan.'}
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 h-11 font-semibold rounded-lg"
              onClick={() => setDeactivateConfirm({ open: false, plan: null })}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 font-semibold rounded-lg"
              onClick={executeDeactivate}
            >
              Nonaktifkan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, plan: null })} size="sm">
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash size={32} weight="bold" className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Apakah Anda Yakin?</h3>
          <p className="text-neutral-500 text-sm mb-6">
            {deleteConfirm.plan ? `Paket "${deleteConfirm.plan.name}" akan dihapus.` : 'Paket akan dihapus.'}
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 h-11 font-semibold rounded-lg"
              onClick={() => setDeleteConfirm({ open: false, plan: null })}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 font-semibold rounded-lg"
              onClick={executeDelete}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlansPage;