import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Funnel,
  CaretRight,
  CaretLeft,
  CalendarCheck,
} from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import AddScheduleModal from './components/AddScheduleModal';
import EditScheduleModal from './components/EditScheduleModal';
import type { ScheduleEntry } from './components/EditScheduleModal';
import { mockTeachers } from '@/lib/api/mock';
import { MOCK_SCHEDULE_GROUPS } from './SchedulesPage';
import { DAYS, TIME_SLOTS, BREAK_SLOT_INDEX } from './components/scheduleConstants';

// --- Dummy data berbagai durasi untuk visualisasi ---
const MOCK_SCHEDULE_ENTRIES: ScheduleEntry[] = [
  // ─── Senin ───
  // 3 jam (sebelum istirahat)
  { id: 's1', classId: 'xi-ipa-1', day: 'Senin', startSlot: 0, endSlot: 3, subject: 'Matematika', teacherId: '2', location: 'XI-A', startTime: '07:00', endTime: '10:00' },
  // 2 jam (sebelum istirahat)
  { id: 's2', classId: 'xi-ipa-1', day: 'Senin', startSlot: 3, endSlot: 5, subject: 'IPA', teacherId: '5', location: 'XI-A', startTime: '10:00', endTime: '12:00' },
  // 2 jam (setelah istirahat)
  { id: 's3', classId: 'xi-ipa-1', day: 'Senin', startSlot: 6, endSlot: 8, subject: 'Sejarah', teacherId: '4', location: 'XI-A', startTime: '13:00', endTime: '15:00' },
  // 1 jam
  { id: 's4', classId: 'xi-ipa-1', day: 'Senin', startSlot: 8, endSlot: 9, subject: 'Seni Budaya', teacherId: '7', location: 'XI-A', startTime: '15:00', endTime: '16:00' },

  // ─── Selasa ───
  // 2 jam
  { id: 's5', classId: 'xi-ipa-1', day: 'Selasa', startSlot: 0, endSlot: 2, subject: 'Bahasa Indonesia', teacherId: '1', location: 'XI-A', startTime: '07:00', endTime: '09:00' },
  // 3 jam (sebelum istirahat)
  { id: 's6', classId: 'xi-ipa-1', day: 'Selasa', startSlot: 2, endSlot: 5, subject: 'Fisika', teacherId: '5', location: 'Lab Fisika', startTime: '09:00', endTime: '12:00' },
  // 1 jam
  { id: 's7', classId: 'xi-ipa-1', day: 'Selasa', startSlot: 6, endSlot: 7, subject: 'PKN', teacherId: '9', location: 'XI-A', startTime: '13:00', endTime: '14:00' },
  // 2 jam
  { id: 's8', classId: 'xi-ipa-1', day: 'Selasa', startSlot: 7, endSlot: 9, subject: 'Ekonomi', teacherId: '3', location: 'XI-A', startTime: '14:00', endTime: '16:00' },

  // ─── Rabu ───
  // 4 jam — MELEWATI ISTIRAHAT (slot 0–5, break di slot 5)
  { id: 's9', classId: 'xi-ipa-1', day: 'Rabu', startSlot: 0, endSlot: 5, subject: 'Kimia', teacherId: '5', location: 'Lab Fisika', startTime: '07:00', endTime: '12:00' },
  // 1 jam
  { id: 's10', classId: 'xi-ipa-1', day: 'Rabu', startSlot: 6, endSlot: 7, subject: 'Bahasa Inggris', teacherId: '1', location: 'XI-A', startTime: '13:00', endTime: '14:00' },
  // 2 jam
  { id: 's11', classId: 'xi-ipa-1', day: 'Rabu', startSlot: 7, endSlot: 9, subject: 'Biologi', teacherId: '6', location: 'Lab', startTime: '14:00', endTime: '16:00' },

  // ─── Kamis ───
  // 1 jam
  { id: 's12', classId: 'xi-ipa-1', day: 'Kamis', startSlot: 0, endSlot: 1, subject: 'Pendidikan Agama', teacherId: '4', location: 'XI-A', startTime: '07:00', endTime: '08:00' },
  // 5 jam — MELEWATI ISTIRAHAT (slot 1–6, break di slot 5)
  { id: 's13', classId: 'xi-ipa-1', day: 'Kamis', startSlot: 1, endSlot: 6, subject: 'Matematika', teacherId: '2', location: 'XI-A', startTime: '08:00', endTime: '13:00' },
  // 3 jam (setelah istirahat, sampai akhir)
  { id: 's14', classId: 'xi-ipa-1', day: 'Kamis', startSlot: 6, endSlot: 9, subject: 'Geografi', teacherId: '3', location: 'XI-A', startTime: '13:00', endTime: '16:00' },

  // ─── Jumat ───
  // 2 jam
  { id: 's15', classId: 'xi-ipa-1', day: 'Jumat', startSlot: 0, endSlot: 2, subject: 'Sejarah', teacherId: '4', location: 'XI-A', startTime: '07:00', endTime: '09:00' },
  // 2 jam
  { id: 's16', classId: 'xi-ipa-1', day: 'Jumat', startSlot: 2, endSlot: 4, subject: 'Prakarya', teacherId: '8', location: 'XI-A', startTime: '09:00', endTime: '11:00' },
  // 1 jam
  { id: 's17', classId: 'xi-ipa-1', day: 'Jumat', startSlot: 4, endSlot: 5, subject: 'Seni Budaya', teacherId: '7', location: 'XI-A', startTime: '11:00', endTime: '12:00' },
  // 3 jam (setelah istirahat)
  { id: 's18', classId: 'xi-ipa-1', day: 'Jumat', startSlot: 6, endSlot: 9, subject: 'Bahasa Inggris', teacherId: '1', location: 'XI-A', startTime: '13:00', endTime: '16:00' },
];

const teacherName = (id: string) => mockTeachers.find((t) => t.id === id)?.name || id;

const ScheduleDetailPage: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const rombel = MOCK_SCHEDULE_GROUPS
    .flatMap((g) => g.classes)
    .find((c) => c.id === classId);

  const [entries, setEntries] = useState(
    MOCK_SCHEDULE_ENTRIES.filter((e) => e.classId === classId),
  );
  const [viewMode, setViewMode] = useState<'mingguan' | 'bulanan'>('mingguan');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // Calendar state — offset from January 2026
  const [calOffset, setCalOffset] = useState(0);
  const baseYear = 2026;
  const baseMonth = 0; // January (0-indexed)
  const calMonth = (baseMonth + calOffset + 12) % 12;
  const calYear = baseYear + Math.floor((baseMonth + calOffset) / 12);
  const monthName = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][calMonth];
  const calDaysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const calFirstDow = (new Date(calYear, calMonth, 1).getDay() + 6) % 7; // Mon=0, Sun=6
  const WEEKDAYS_SHORT = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const WEEKDAYS_FULL = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

  // Group entries by day for calendar lookup
  const entriesByDay = useMemo(() => {
    const map: Record<string, ScheduleEntry[]> = {};
    entries.forEach((e) => {
      if (!map[e.day]) map[e.day] = [];
      map[e.day].push(e);
    });
    // Sort each day by startSlot
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.startSlot - b.startSlot));
    return map;
  }, [entries]);
  const [editingEntry, setEditingEntry] = useState<ScheduleEntry | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [dropInvalid, setDropInvalid] = useState(false);

  const clearDrag = () => {
    setDraggingId(null);
    setDropTarget(null);
    setDropInvalid(false);
  };

  // Drop-target highlight: blue=empty(move), amber=occupied(swap), red=break(invalid)
  const getDropClass = (cellKey: string, isOccupied: boolean) => {
    if (dropTarget !== cellKey || !draggingId) return '';
    if (dropInvalid) return 'bg-[#FFF5F5] outline outline-2 outline-dashed outline-red-400';
    return isOccupied
      ? 'bg-[#FFF8E6] outline outline-2 outline-dashed outline-amber-400'
      : 'bg-[#F2F9FF] outline outline-2 outline-dashed outline-[#3E80F9]';
  };

  // Mark a cell as drop target: blue=empty(move), amber=occupied(swap), red=break(invalid)
  const markDrop = (day: string, slotIdx: number) => {
    if (!draggingId) return;
    const cellKey = `${day}|${slotIdx}`;
    setDropTarget(cellKey);
    // Break slot = invalid; occupied = swap (valid); empty = move (valid)
    setDropInvalid(slotIdx === BREAK_SLOT_INDEX);
  };

  const dropOn = (day: string, slotIdx: number) => {
    if (!draggingId) return;
    if (slotIdx === BREAK_SLOT_INDEX) { clearDrag(); return; }
    // Check if target cell is occupied by another entry → swap
    const occupantId = gridByDay[day]?.[slotIdx];
    if (occupantId && occupantId !== draggingId) {
      swapEntry(draggingId, occupantId);
    } else {
      moveEntry(draggingId, day, slotIdx);
    }
    clearDrag();
  };

  // --- CRUD ---
  const slotToTime = (slot: number): string => {
    const h = slot + 7;
    return `${String(h).padStart(2, '0')}:00`;
  };

  const moveEntry = (id: string, targetDay: string, targetSlot: number) => {
    const moving = entries.find((e) => e.id === id);
    if (!moving) return;
    const dur = moving.endSlot - moving.startSlot;
    if (targetSlot + dur > TIME_SLOTS.length) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              day: targetDay,
              startSlot: targetSlot,
              endSlot: targetSlot + dur,
              startTime: slotToTime(targetSlot),
              endTime: slotToTime(targetSlot + dur),
            }
          : e,
      ),
    );
  };

  // Swap two entries' positions (day + time), keeping each entry's own duration
  const swapEntry = (idA: string, idB: string) => {
    const a = entries.find((e) => e.id === idA);
    const b = entries.find((e) => e.id === idB);
    if (!a || !b) return;
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id === idA) {
          return {
            ...e,
            day: b.day,
            startSlot: b.startSlot,
            endSlot: b.endSlot,
            startTime: slotToTime(b.startSlot),
            endTime: slotToTime(b.endSlot),
          };
        }
        if (e.id === idB) {
          return {
            ...e,
            day: a.day,
            startSlot: a.startSlot,
            endSlot: a.endSlot,
            startTime: slotToTime(a.startSlot),
            endTime: slotToTime(a.endSlot),
          };
        }
        return e;
      }),
    );
  };

  // Convert time string "HH:MM" to slot index
  const timeToSlot = (time: string): number => {
    const [h] = time.split(':').map(Number);
    return Math.max(0, Math.min(h - 7, TIME_SLOTS.length - 1));
  };

  const addEntry = (data: any) => {
    let startSlot = data.startTime ? timeToSlot(data.startTime) : (data.startSlot ?? 0);
    let endSlot = data.endTime ? timeToSlot(data.endTime) : (data.endSlot ?? startSlot + 1);
    // Keep the entry out of the ISTIRAHAT row itself
    if (startSlot === BREAK_SLOT_INDEX) startSlot = BREAK_SLOT_INDEX + 1;
    if (endSlot === BREAK_SLOT_INDEX) endSlot = BREAK_SLOT_INDEX;
    setEntries((prev) => [
      ...prev,
      {
        id: `s-${Date.now()}`,
        classId: classId!,
        day: data.day || DAYS[0],
        startSlot,
        endSlot: endSlot > startSlot ? endSlot : startSlot + 1,
        subject: data.subject,
        teacherId: data.teacherId,
        location: data.location,
        date: data.date,
        academicYear: data.academicYear,
        startTime: data.startTime,
        endTime: data.endTime,
        isActive: data.isActive ?? true,
      },
    ]);
  };

  const updateEntry = (id: string, data: Partial<ScheduleEntry>) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const merged = { ...e, ...data };
        // Recompute slots whenever times changed
        if (merged.startTime && merged.endTime) {
          let s = timeToSlot(merged.startTime);
          let en = timeToSlot(merged.endTime);
          if (s === BREAK_SLOT_INDEX) s = BREAK_SLOT_INDEX + 1;
          if (en === BREAK_SLOT_INDEX) en = BREAK_SLOT_INDEX;
          merged.startSlot = s;
          merged.endSlot = en > s ? en : s + 1;
        }
        return merged;
      }),
    );
  };

  // --- Grid map: track which slot each day's entry occupies ---
  // Break slot (ISTIRAHAT) is skipped so entries spanning across it
  // get a correct rowSpan without conflicting with the break row's own <td>s.
  const { gridByDay, entryMap, occupiedAtBreak } = useMemo(() => {
    const g: Record<string, (string | null)[]> = {};
    const m: Record<string, ScheduleEntry> = {};
    const ob = new Set<string>();
    DAYS.forEach((d) => {
      g[d] = new Array(TIME_SLOTS.length).fill(null);
    });
    entries.forEach((e) => {
      for (let s = e.startSlot; s < e.endSlot && s < TIME_SLOTS.length; s++) {
        if (s === BREAK_SLOT_INDEX) continue; // don't mark break slot
        if (g[e.day]) g[e.day][s] = e.id;
      }
      m[e.id] = e;
      // Track entries that span across the break so the break row can skip that column
      if (e.startSlot < BREAK_SLOT_INDEX && e.endSlot > BREAK_SLOT_INDEX) {
        ob.add(e.day);
      }
    });
    return { gridByDay: g, entryMap: m, occupiedAtBreak: ob };
  }, [entries]);

  // Date labels for headers (Figma: Senin 6, Selasa 7, ...)
  const dayDates = [6, 7, 8, 9, 10];

  return (
    <div className="space-y-6">
      {/* --- Breadcrumb --- */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarCheck size={28} className="text-neutral-500" />
          <h1 className="text-2xl font-bold text-neutral-600">Autentikasi</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
          <span className="hover:text-[#3E80F9] cursor-pointer" onClick={() => navigate('/admin')}>
            Dasbor
          </span>
          <CaretRight size={12} className="mx-2" />
          <span className="hover:text-[#3E80F9] cursor-pointer" onClick={() => navigate('/admin/master/schedules')}>
            Jadwal
          </span>
          <CaretRight size={12} className="mx-2" />
          <span className="text-[#3E80F9] font-medium">Detail jadwal</span>
        </div>
      </div>

      {/* --- Controls row: pill tabs + month dropdown | filter + tambah --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Mingguan / Bulanan pills */}
          <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden text-sm font-medium">
            <button
              className={cn(
                'px-5 py-2 transition-colors',
                viewMode === 'mingguan'
                  ? 'bg-[#3E80F9] text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50',
              )}
              onClick={() => setViewMode('mingguan')}
            >
              Mingguan
            </button>
            <button
              className={cn(
                'px-5 py-2 transition-colors border-l border-neutral-300',
                viewMode === 'bulanan'
                  ? 'bg-[#3E80F9] text-white'
                  : 'bg-white text-neutral-600 hover:bg-neutral-50',
              )}
              onClick={() => setViewMode('bulanan')}
            >
              Bulanan
            </button>
          </div>

          {/* Month dropdown — synced to calOffset */}
          <select
            value={calOffset}
            onChange={(e) => setCalOffset(Number(e.target.value))}
            className="h-10 px-4 pr-8 rounded-lg border border-neutral-300 bg-neutral-100 text-sm font-medium text-neutral-700 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22%23666%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3E80F9]"
          >
            {[-2, -1, 0, 1, 2].map((off) => {
              const m = (baseMonth + off + 12) % 12;
              const y = baseYear + Math.floor((baseMonth + off) / 12);
              const mLabel = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'][m];
              return <option key={off} value={off}>{mLabel} {y}</option>;
            })}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            className="h-10 border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 font-medium"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Funnel size={18} weight="bold" className="mr-2" />
            Filter
          </Button>
          <Button
            variant="primary"
            className="h-10 bg-[#3E80F9] hover:bg-[#2E6EF7] text-white font-medium"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Tambah Jadwal
          </Button>
        </div>
      </div>

      {/* --- Week navigation / calendar header --- */}
      {viewMode === 'mingguan' ? (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">Minggu ke-1, Januari 2026</h2>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">
              <CaretLeft size={16} className="text-neutral-500" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors">
              <CaretRight size={16} className="text-neutral-500" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-neutral-900">{monthName} {calYear}</h2>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
              onClick={() => setCalOffset((o) => o - 1)}
            >
              <CaretLeft size={16} className="text-neutral-500" />
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 transition-colors"
              onClick={() => setCalOffset((o) => o + 1)}
            >
              <CaretRight size={16} className="text-neutral-500" />
            </button>
          </div>
        </div>
      )}

      {/* --- Calendar (bulanan) --- */}
      {viewMode === 'bulanan' && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          {/* Weekday header — Mon first, matching DAYS order */}
          <div className="grid grid-cols-7 min-w-[720px] bg-[#E5E7EB]">
            {WEEKDAYS_SHORT.map((d, i) => (
              <div key={d} className="px-3 py-3 text-center text-xs font-semibold text-neutral-500 border-r border-neutral-200 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          {/* Day grid */}
          <div className="grid grid-cols-7 min-w-[720px]">
            {/* Leading days from previous month */}
            {Array.from({ length: calFirstDow }).map((_, i) => (
              <div key={`lead-${i}`} className="min-h-[104px] px-2 py-1.5 border-r border-b border-neutral-200 bg-neutral-50/50 text-[11px] text-neutral-300">
                {calDaysInMonth - calFirstDow + 1 + i}
              </div>
            ))}
            {/* Days of this month */}
            {Array.from({ length: calDaysInMonth }).map((_, i) => {
              const date = i + 1;
              const dow = (calFirstDow + i) % 7; // 0=Mon
              const dayOfWeek = dow < 5 ? WEEKDAYS_FULL[dow] : null; // only Mon-Fri have classes
              const dayEntries = dayOfWeek ? entriesByDay[dayOfWeek] ?? [] : [];
              const visible = dayEntries.slice(0, 3);
              const overflow = dayEntries.length - visible.length;
              return (
                <div
                  key={`day-${date}`}
                  className="min-h-[104px] px-2 py-1.5 border-r border-b border-neutral-200 last:border-r-0 align-top"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      'text-xs font-bold',
                      dow >= 5 ? 'text-neutral-400' : 'text-neutral-900',
                    )}>
                      {date}
                    </span>
                    {dayEntries.length > 0 && dow < 5 && (
                      <span className="text-[10px] font-semibold text-[#3E80F9]">{dayEntries.length} jadwal</span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {visible.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setEditingEntry(entry)}
                        className="w-full text-left rounded-md px-2 py-1 bg-[#F0F4FF] border-l-[3px] border-l-[#3E80F9] border border-[#D6E0FF] hover:border-[#3E80F9] transition-colors"
                      >
                        <div className="text-[11px] font-bold text-neutral-900 leading-tight truncate">{entry.subject}</div>
                        <div className="text-[10px] text-neutral-500 leading-tight truncate">
                          {entry.startTime ? `${entry.startTime}–${entry.endTime}` : `${entry.startSlot+7}:00`}
                        </div>
                      </button>
                    ))}
                    {overflow > 0 && (
                      <div className="text-[10px] font-medium text-neutral-500 px-1">+{overflow} lainnya</div>
                    )}
                  </div>
                </div>
              );
            })}
            {/* Trailing cells to complete the last week */}
            {Array.from({ length: (7 - (calFirstDow + calDaysInMonth) % 7) % 7 }).map((_, i) => (
              <div key={`trail-${i}`} className="min-h-[104px] px-2 py-1.5 border-r border-b border-neutral-200 last:border-r-0 bg-neutral-50/50 text-[11px] text-neutral-300">
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Timetable --- */}
      {viewMode === 'mingguan' && (
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-[#E5E7EB]">
              <th className="w-36 px-4 py-3 text-center text-xs font-semibold text-neutral-500">
                Waktu
              </th>
              {DAYS.map((day, i) => (
                <th key={day} className="px-4 py-3 text-center">
                  <div className="text-sm font-bold text-neutral-900">{day}</div>
                  <div className="text-xs font-medium text-neutral-500">{dayDates[i]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, slotIdx) => {
              // ISTIRAHAT row — individual cells per day
              if (slotIdx === BREAK_SLOT_INDEX) {
                return (
                  <tr key={`break-${slotIdx}`} className="border-b border-neutral-200">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-500 bg-white whitespace-nowrap border-r border-neutral-200">
                      {slot}
                    </td>
                    {DAYS.map((day) => {
                      // Column is already spanned by a card from a row above — skip this cell
                      if (occupiedAtBreak.has(day)) return null;
                      return (
                        <td
                          key={day}
                          className="px-4 py-3 text-center border-r border-neutral-200 last:border-r-0"
                        >
                          <div className="h-full min-h-[64px] flex items-center justify-center rounded-lg bg-neutral-100">
                            <span className="text-sm font-bold text-neutral-600 tracking-wide">
                              ISTIRAHAT
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              }

              return (
                <tr key={`slot-${slotIdx}`} className="border-b border-neutral-200 last:border-b-0">
                  {/* Time label */}
                  <td className="px-4 py-3 text-sm font-medium text-neutral-500 bg-white whitespace-nowrap border-r border-neutral-200">
                    {slot}
                  </td>

                  {DAYS.map((day) => {
                    const occupyingId = gridByDay[day]?.[slotIdx];
                    const entry = occupyingId ? entryMap[occupyingId] : null;

                    // Skip — this cell is spanned by a card from a previous slot
                    if (entry && entry.startSlot < slotIdx) return null;

                    // This cell is the START of an entry (or a single-slot entry)
                    if (entry && entry.startSlot === slotIdx) {
                      const span = entry.endSlot - entry.startSlot;
                      const cellKey = `${day}|${slotIdx}`;
                      const isOccupied = entry.id !== draggingId;
                      return (
                        <td
                          key={day}
                          rowSpan={span}
                          className={cn(
                            'px-1.5 py-1.5 align-top border-r border-neutral-200 last:border-r-0 transition-colors',
                            getDropClass(cellKey, isOccupied),
                          )}
                          onDragOver={(e) => { e.preventDefault(); markDrop(day, slotIdx); }}
                          onDragLeave={() => setDropTarget((d) => (d === cellKey ? null : d))}
                          onDrop={() => dropOn(day, slotIdx)}
                        >
                          <button
                            onClick={() => setEditingEntry(entry)}
                            draggable
                            onDragStart={() => setDraggingId(entry.id)}
                            onDragEnd={clearDrag}
                            className={cn(
                              'w-full h-full min-h-[64px] text-left rounded-lg p-3 transition-all group cursor-grab active:cursor-grabbing select-none flex flex-col justify-center',
                              'bg-[#F0F4FF] border-l-[3px] border-l-[#3E80F9] border border-[#D6E0FF]',
                              draggingId === entry.id && 'opacity-40',
                              draggingId && draggingId !== entry.id && 'opacity-60',
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-neutral-900">{entry.subject}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#3E80F9] text-[10px] font-semibold text-white leading-none">
                                Aktif
                              </span>
                            </div>
                            <div className="text-xs text-neutral-600">{teacherName(entry.teacherId)}</div>
                            <div className="text-xs text-neutral-500">{entry.location}</div>
                            {entry.startTime && entry.endTime && (
                              <div className="text-[10px] text-neutral-400 mt-1">{entry.startTime} – {entry.endTime}</div>
                            )}
                          </button>
                        </td>
                      );
                    }

                    // Empty cell — also a valid drop target
                    const cellKey = `${day}|${slotIdx}`;
                    return (
                      <td
                        key={day}
                        className={cn(
                          'px-1.5 py-1.5 border-r border-neutral-200 last:border-r-0 transition-colors',
                          getDropClass(cellKey, false),
                        )}
                        onDragOver={(e) => { e.preventDefault(); markDrop(day, slotIdx); }}
                        onDragLeave={() => setDropTarget((d) => (d === cellKey ? null : d))}
                        onDrop={() => dropOn(day, slotIdx)}
                      >
                        <div className="h-full min-h-[64px] rounded-lg bg-white" />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* --- Modals --- */}
      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={addEntry}
      />

      {editingEntry && (
        <EditScheduleModal
          key={editingEntry.id}
          isOpen={!!editingEntry}
          onClose={() => setEditingEntry(null)}
          entry={editingEntry}
          onSave={updateEntry}
        />
      )}
    </div>
  );
};

export default ScheduleDetailPage;