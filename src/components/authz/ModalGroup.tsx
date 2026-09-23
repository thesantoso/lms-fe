import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CaretDown } from '@phosphor-icons/react';
import type { AuthGroup, PermissionNode } from '@/types';

interface ModalGroupProps {
  mode: 'create' | 'edit';
  group?: AuthGroup | null;
  permissions: PermissionNode[];
  loading?: boolean;
  onClose: () => void;
  onSave: (data: Omit<AuthGroup, 'id'> & { id?: string }) => void;
}

// flatten pohon permission menjadi nilai-nilai leaf
const leafValues = (nodes: PermissionNode[]): string[] =>
  nodes.flatMap((n) => (n.children?.length ? leafValues(n.children) : [n.value]));

// seluruh nilai (termasuk parent) untuk menentukan checked state parent
const allValues = (nodes: PermissionNode[]): string[] =>
  nodes.flatMap((n) => [n.value, ...(n.children?.length ? allValues(n.children) : [])]);

const ModalGroup: React.FC<ModalGroupProps> = ({
  mode,
  group,
  permissions,
  loading,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(group?.name || '');
  const [keyName, setKeyName] = useState(group?.key || '');
  const [checked, setChecked] = useState<Set<string>>(new Set(group?.permissions || []));
  const [error, setError] = useState('');

  const toggle = (value: string, node?: PermissionNode) => {
    setChecked((prev) => {
      const next = new Set(prev);
      // kalau node punya anak, tick/un-tick seluruh subtree
      const affected = node ? [value, ...leafValues([node])] : [value];
      const willCheck = !next.has(value);
      affected.forEach((v) => (willCheck ? next.add(v) : next.delete(v)));
      return next;
    });
  };

  const parentChecked = (node: PermissionNode) => {
    const leaves = leafValues([node]);
    return leaves.length > 0 && leaves.every((v) => checked.has(v));
  };
  const parentIndeterminate = (node: PermissionNode) => {
    const leaves = leafValues([node]);
    return leaves.some((v) => checked.has(v)) && !parentChecked(node);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError('Nama grup wajib diisi.');
      return;
    }
    onSave({
      id: group?.id,
      key: keyName.trim() || name.trim().toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      permissions: Array.from(checked),
    });
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Tambah Grup' : 'Edit Grup'}
      size="lg"
      subtitle="Grup menentukan hak akses user terhadap menu sistem"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Grup *"
            placeholder="cth: Supervisor Akademik"
            value={name}
            error={error}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
          />
          <Input
            label="Key"
            placeholder="cth: supervisor_akademik"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
        </div>

        {/* Permission tree */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Hak Akses (Permission)
          </label>
          <div className="border border-neutral-200 rounded-lg p-4 space-y-4 max-h-80 overflow-y-auto">
            <p className="text-xs text-neutral-400">
              Centang menu dan aksinya. Mencek menu induk akan mencakup seluruh aksinya.
            </p>
            {permissions.map((parent) => (
              <div key={parent.value} className="border border-neutral-100 rounded-lg p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    checked={parentChecked(parent) || checked.has(parent.value)}
                    ref={(el) => {
                      if (el) el.indeterminate = parentIndeterminate(parent);
                    }}
                    onChange={() => toggle(parent.value, parent)}
                  />
                  <span className="text-sm font-semibold text-neutral-800 flex items-center gap-1">
                    {parent.label}
                    <CaretDown size={12} className="text-neutral-300" />
                  </span>
                </label>
                {parent.children?.length ? (
                  <div className="mt-2 pl-6 space-y-1.5">
                    {parent.children.map((child) => (
                      <div key={child.value} className="space-y-1.5">
                        {child.children?.length ? (
                          <>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                checked={checked.has(child.value)}
                                onChange={() => toggle(child.value, child)}
                              />
                              <span className="text-sm font-medium text-neutral-700">{child.label}</span>
                            </label>
                            <div className="pl-6 space-y-1.5">
                              {child.children.map((leaf) => (
                                <label key={leaf.value} className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                                    checked={checked.has(leaf.value)}
                                    onChange={() => toggle(leaf.value)}
                                  />
                                  <span className="text-sm text-neutral-600">{leaf.label}</span>
                                </label>
                              ))}
                            </div>
                          </>
                        ) : (
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                              checked={checked.has(child.value)}
                              onChange={() => toggle(child.value)}
                            />
                            <span className="text-sm text-neutral-600">{child.label}</span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-800">{checked.size}</span> permission terpilih
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

export default ModalGroup;