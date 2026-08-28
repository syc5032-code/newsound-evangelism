import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FilterBar } from './components/FilterBar';
import { MonthCalendar } from './components/MonthCalendar';
import { WeekCalendar } from './components/WeekCalendar';
import { ListView } from './components/ListView';
import { ApplicationModal } from './components/ApplicationModal';
import { DetailModal } from './components/DetailModal';
import { DataManagementModal } from './components/DataManagementModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { EvangelismSchedule, ViewMode } from './types';
import { loadSchedules, saveSchedules, generateKakaoShareText } from './utils/storage';
import { generateMonthGrid } from './utils/dateUtils';
import { addMonths, subMonths } from 'date-fns';

export function App() {
  // 1. Core Data State
  const [schedules, setSchedules] = useState<EvangelismSchedule[]>(() => loadSchedules());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 2. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // 3. Modals State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyModalInitialDate, setApplyModalInitialDate] = useState<string | undefined>(undefined);
  const [editingSchedule, setEditingSchedule] = useState<EvangelismSchedule | null>(null);
  const [selectedDetailSchedule, setSelectedDetailSchedule] = useState<EvangelismSchedule | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // 4. Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Cell filter
      if (selectedCell && item.cellName !== selectedCell) return false;
      // Location filter
      if (selectedLocation && item.location !== selectedLocation) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCell = item.cellName?.toLowerCase().includes(q);
        const matchLeader = item.cellLeader?.toLowerCase().includes(q);
        const matchLocation = item.location?.toLowerCase().includes(q);
        const matchPrayer = item.prayerTopics?.toLowerCase().includes(q);
        const matchParticipants = item.participants?.some((p) => p.toLowerCase().includes(q));
        if (!matchCell && !matchLeader && !matchLocation && !matchPrayer && !matchParticipants) {
          return false;
        }
      }
      return true;
    });
  }, [schedules, selectedCell, selectedLocation, searchQuery]);

  // Calendar days grid
  const calendarDays = useMemo(() => {
    return generateMonthGrid(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      filteredSchedules
    );
  }, [currentDate, filteredSchedules]);

  // Schedule Save Handler (Add / Edit)
  const handleSaveSchedule = (schedule: EvangelismSchedule) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === schedule.id ? schedule : item))
      );
      addToast(`[${schedule.cellName}] 노방전도 일정이 수정되었습니다.`, 'success');
      setEditingSchedule(null);
    } else {
      setSchedules((prev) => [schedule, ...prev]);
      addToast(`[${schedule.cellName}] 노방전도 신청이 성공적으로 등록되었습니다! 🎉`, 'success');
    }
  };

  // Schedule Delete Handler
  const handleDeleteSchedule = (id: string) => {
    const target = schedules.find((s) => s.id === id);
    setSchedules((prev) => prev.filter((item) => item.id !== id));
    if (selectedDetailSchedule?.id === id) {
      setSelectedDetailSchedule(null);
    }
    addToast(`[${target?.cellName || '일정'}] 노방전도 일정이 삭제되었습니다.`, 'info');
  };

  // Schedule Edit Handler
  const handleStartEditSchedule = (schedule: EvangelismSchedule) => {
    setEditingSchedule(schedule);
    setSelectedDetailSchedule(null);
    setIsApplyModalOpen(true);
  };

  // Copy Kakao text handler
  const handleCopyShareText = async (schedule: EvangelismSchedule) => {
    const text = generateKakaoShareText(schedule);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      addToast('카카오톡/문자 공유 텍스트가 클립보드에 복사되었습니다! 📋', 'success');
    } catch {
      addToast('클립보드 복사에 실패했습니다.', 'error');
    }
  };

  // Open apply modal for specific date
  const handleOpenApplyModalForDate = (dateStr: string) => {
    setEditingSchedule(null);
    setApplyModalInitialDate(dateStr);
    setIsApplyModalOpen(true);
  };

  // Month navigation
  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCell('');
    setSelectedLocation('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      
      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenApplyModal={() => {
          setEditingSchedule(null);
          setApplyModalInitialDate(undefined);
          setIsApplyModalOpen(true);
        }}
        onOpenDataModal={() => setIsDataModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Statistics & Overview Banner */}
        <StatsBanner
          schedules={filteredSchedules}
          currentDate={currentDate}
          onSelectSchedule={(s) => setSelectedDetailSchedule(s)}
        />

        {/* Search & Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedCell={selectedCell}
          onSelectedCellChange={setSelectedCell}
          selectedLocation={selectedLocation}
          onSelectedLocationChange={setSelectedLocation}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredSchedules.length}
        />

        {/* Active View: Month / Week / List */}
        {viewMode === 'month' && (
          <MonthCalendar
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            calendarDays={calendarDays}
            onSelectSchedule={(s) => setSelectedDetailSchedule(s)}
            onOpenApplyModalForDate={handleOpenApplyModalForDate}
          />
        )}

        {viewMode === 'week' && (
          <WeekCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            schedules={filteredSchedules}
            onSelectSchedule={(s) => setSelectedDetailSchedule(s)}
            onOpenApplyModalForDate={handleOpenApplyModalForDate}
          />
        )}

        {viewMode === 'list' && (
          <ListView
            schedules={filteredSchedules}
            onSelectSchedule={(s) => setSelectedDetailSchedule(s)}
            onCopyShareText={handleCopyShareText}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 뉴사운드교회 청년부 및 교구 노방전도 사역팀</p>
          <p className="text-slate-400">
            "너희는 온 천하에 다니며 만민에게 복음을 전파하라 (막 16:15)"
          </p>
        </div>
      </footer>

      {/* Application / Edit Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule}
        initialDate={applyModalInitialDate}
        editSchedule={editingSchedule}
      />

      {/* Detail Modal */}
      <DetailModal
        schedule={selectedDetailSchedule}
        onClose={() => setSelectedDetailSchedule(null)}
        onEdit={handleStartEditSchedule}
        onDelete={handleDeleteSchedule}
        onCopyShareText={handleCopyShareText}
      />

      {/* Data Management & Export Modal */}
      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        schedules={schedules}
        onDataRestored={(restored) => setSchedules(restored)}
        onShowToast={addToast}
      />

    </div>
  );
}

export default App;
