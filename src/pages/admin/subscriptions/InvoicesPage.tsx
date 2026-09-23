import React, { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Receipt,
  MagnifyingGlass,
  Trash,
  CaretLeft,
  CaretRight,
  PencilSimple,
  CheckCircle,
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Modal from '@/components/ui/Modal';
import InvoiceFormModal from './components/InvoiceFormModal';
import { mockInvoices } from '@/data/subscriptions';
import type { SubscriptionInvoice } from '@/data/subscriptions';

type ModalMode = 'create' | 'edit';

const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const formatRupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

const statusLabel = { paid: 'Lunas', unpaid: 'Belum Dibayar', overdue: 'Terlambat' } as const;
const statusBadge = {
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700',
} as const;

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>(mockInvoices);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; invoice: SubscriptionInvoice | null }>({
    open: false,
    mode: 'create',
    invoice: null,
  });
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; ids: string[]; invoiceNumber?: string }>({
    open: false,
    ids: [],
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
      invoices.filter(
        (inv) =>
          (inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.planName.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (statusFilter ? inv.status === statusFilter : true),
      ),
    [invoices, searchTerm, statusFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / parseInt(entriesPerPage)));
  const paginated = filtered.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage),
  );
  const isAllSelected = paginated.length > 0 && paginated.every((inv) => selectedIds.has(inv.id));

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginated.forEach((inv) => (checked ? next.add(inv.id) : next.delete(inv.id)));
      return next;
    });
  };
  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const openCreate = () => setModal({ open: true, mode: 'create', invoice: null });
  const openEdit = (invoice: SubscriptionInvoice) => setModal({ open: true, mode: 'edit', invoice });

  const handleSave = (data: Omit<SubscriptionInvoice, 'id'> & { id?: string }) => {
    setSaving(true);
    try {
      if (data.id) {
        setInvoices((prev) => prev.map((inv) => (inv.id === data.id ? { id: data.id, ...data } : inv)));
      } else {
        const next: SubscriptionInvoice = { ...data, id: `inv-${Date.now()}` };
        setInvoices((prev) => [next, ...prev]);
      }
      setModal((m) => ({ ...m, open: false }));
      setNotice(data.id ? 'Tagihan berhasil diperbarui!' : 'Tagihan berhasil ditambahkan!');
    } finally {
      setSaving(false);
    }
  };

  const markPaid = (invoice: SubscriptionInvoice) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? { ...inv, status: 'paid' as const } : inv)));
    setNotice(`${invoice.invoiceNumber} ditandai lunas.`);
  };

  const removeInvoices = async (ids: string[]) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setError('');
    try {
      setInvoices((prev) => prev.filter((inv) => !ids.includes(inv.id)));
      setSelectedIds(new Set());
      setConfirmDialog({ open: false, ids: [], invoiceNumber: undefined });
      setNotice(`${ids.length} tagihan berhasil dihapus!`);
    } catch {
      setError('Gagal menghapus tagihan. Coba lagi.');
    } finally {
      setLoading(false);
    }
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
          <span className="text-blue-600 font-medium">Riwayat Tagihan</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>
      )}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
          {notice}
        </div>
      )}

      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Data Tagihan</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200 px-4 font-medium h-10"
                disabled={selectedIds.size === 0 || loading}
                onClick={() => setConfirmDialog({ open: true, ids: Array.from(selectedIds), invoiceNumber: undefined })}
              >
                <Trash size={20} className="mr-2" />
                Hapus
              </Button>
              <Button
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 font-medium h-10 border-none"
                onClick={openCreate}
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Tambah Tagihan
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: '5', label: '5' },
                  { value: '10', label: '10' },
                  { value: '25', label: '25' },
                ]}
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="w-[70px] h-10 rounded-lg border-neutral-300"
              />
              <span className="text-sm text-neutral-500">jumlah entri per halaman</span>
              <Select
                options={[
                  { value: '', label: 'Semua Status' },
                  { value: 'paid', label: 'Lunas' },
                  { value: 'unpaid', label: 'Belum Dibayar' },
                  { value: 'overdue', label: 'Terlambat' },
                ]}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40 h-10 rounded-lg border-neutral-300"
              />
            </div>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Cari invoice, sekolah, atau paket..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<MagnifyingGlass size={20} className="text-neutral-400" />}
                className="h-10 border-neutral-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-neutral-200 mb-6">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-neutral-100">
                <tr className="border-b border-neutral-200 text-left">
                  <th className="px-4 py-4 w-12 text-center">
                    <Checkbox checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} />
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">No</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">No. Invoice</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Sekolah</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Paket</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Jumlah</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Tanggal Terbit</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Jatuh Tempo</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Status</th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </td>
                  </tr>
                ) : paginated.map((invoice, index) => (
                  <tr key={invoice.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <Checkbox
                        checked={selectedIds.has(invoice.id)}
                        onChange={(e) => toggleSelectOne(invoice.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-600 font-medium">
                      {(currentPage - 1) * parseInt(entriesPerPage) + index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-900 font-medium font-mono">{invoice.invoiceNumber}</td>
                    <td className="px-4 py-4 text-sm text-neutral-900 font-medium">{invoice.schoolName}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{invoice.planName}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600 font-medium">{formatRupiah(invoice.amount)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{formatDate(invoice.issuedAt)}</td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{formatDate(invoice.dueAt)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusBadge[invoice.status]}`}
                      >
                        {statusLabel[invoice.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {invoice.status !== 'paid' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                            onClick={() => markPaid(invoice)}
                          >
                            <CheckCircle size={14} weight="bold" className="mr-1" />
                            Lunas
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md"
                          onClick={() => openEdit(invoice)}
                        >
                          <PencilSimple size={14} weight="bold" className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs text-white bg-red-500 hover:bg-red-600 rounded-md"
                          onClick={() =>
                            setConfirmDialog({ open: true, ids: [invoice.id], invoiceNumber: invoice.invoiceNumber })
                          }
                        >
                          <Trash size={14} weight="bold" className="mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-neutral-500">
                      {searchTerm || statusFilter
                        ? 'Tidak ada tagihan yang cocok dengan pencarian'
                        : 'Belum ada data tagihan'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-sm text-neutral-500">
              Menampilkan{' '}
              <span className="font-medium text-neutral-900">
                {filtered.length === 0 ? 0 : (currentPage - 1) * parseInt(entriesPerPage) + 1}
              </span>{' '}
              hingga{' '}
              <span className="font-medium text-neutral-900">
                {Math.min(currentPage * parseInt(entriesPerPage), filtered.length)}
              </span>{' '}
              dari <span className="font-medium text-neutral-900">{filtered.length}</span> tagihan
            </p>
            <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-r border-neutral-200 flex items-center gap-2 transition-colors"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <CaretLeft size={16} />
                Previous
              </button>
              <div className="flex items-center px-1">
                {totalPages <= 5
                  ? Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all mx-0.5 ${
                          currentPage === page ? 'bg-[#2563EB] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))
                  : currentPage}
              </div>
              <button
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-l border-neutral-200 flex items-center gap-2 transition-colors"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {modal.open && (
        <InvoiceFormModal
          mode={modal.mode}
          invoice={modal.invoice}
          loading={saving}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      <Modal
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, ids: [], invoiceNumber: undefined })}
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash size={32} weight="bold" className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Apakah Anda Yakin?</h3>
          <p className="text-neutral-500 text-sm mb-6">
            {confirmDialog.ids.length > 1
              ? `${confirmDialog.ids.length} tagihan akan dihapus.`
              : confirmDialog.invoiceNumber
                ? `Tagihan ${confirmDialog.invoiceNumber} akan dihapus.`
                : 'Tagihan akan dihapus.'}
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 h-11 font-semibold rounded-lg"
              onClick={() => setConfirmDialog({ open: false, ids: [], invoiceNumber: undefined })}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 font-semibold rounded-lg"
              onClick={() => removeInvoices(confirmDialog.ids)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InvoicesPage;