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
import { AuthPasswordModal } from './components/AuthPasswordModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { EvangelismSchedule, ViewMode } from './types';
import { loadSchedules, saveSchedules, generateKakaoShareText } from './utils/storage';
import { generateMonthGrid } from './utils/dateUtils';
import { addMonths, subMonths } from 'date-fns';
import { Plus } from 'lucide-react';

export function App() {
  // 1. Core Data State
  const [schedules, setSchedules] = useState<EvangelismSchedule[]>(() => loadSchedules());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // 2. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [selectedCorps, setSelectedCorps] = useState('');

  // 3. Admin & Auth State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('NEWSOUND_IS_ADMIN') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionType, setAuthActionType] = useState<'edit' | 'delete' | 'admin-login'>('edit');
  const [authTargetSchedule, setAuthTargetSchedule] = useState<EvangelismSchedule | null>(null);

  // 4. Modals State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyModalInitialDate, setApplyModalInitialDate] = useState<string | undefined>(undefined);
  const [editingSchedule, setEditingSchedule] = useState<EvangelismSchedule | null>(null);
  const [duplicateSchedule, setDuplicateSchedule] = useState<EvangelismSchedule | null>(null);
  const [selectedDetailSchedule, setSelectedDetailSchedule] = useState<EvangelismSchedule | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  // 5. Toast Notifications
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

  // Sync Admin status to LocalStorage
  useEffect(() => {
    localStorage.setItem('NEWSOUND_IS_ADMIN', isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  // Extract all unique registered cells dynamically from schedules
  const availableCells = useMemo(() => {
    const set = new Set<string>();
    schedules.forEach((s) => {
      if (s.cellName && s.cellName.trim()) {
        set.add(s.cellName.trim());
      }
    });
    return Array.from(set).sort();
  }, [schedules]);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      // Cell filter
      if (selectedCell && item.cellName !== selectedCell) return false;
      // Corps filter
      if (selectedCorps && item.corpsName !== selectedCorps) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCell = item.cellName?.toLowerCase().includes(q);
        const matchCorps = item.corpsName?.toLowerCase().includes(q);
        const matchLeader = item.cellLeader?.toLowerCase().includes(q);
        const matchLocation = item.location?.toLowerCase().includes(q);
        const matchPrayer = item.prayerTopics?.toLowerCase().includes(q);
        const matchParticipants = item.participants?.some((p) => p.toLowerCase().includes(q));
        if (!matchCell && !matchCorps && !matchLeader && !matchLocation && !matchPrayer && !matchParticipants) {
          return false;
        }
      }
      return true;
    });
  }, [schedules, selectedCell, selectedCorps, searchQuery]);

  // Calendar days grid
  const calendarDays = useMemo(() => {
    return generateMonthGrid(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      filteredSchedules
    );
  }, [currentDate, filteredSchedules]);

  // Schedule Save Handler (Add / Edit / Duplicate)
  const handleSaveSchedule = (schedule: EvangelismSchedule) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((item) => (item.id === schedule.id ? schedule : item))
      );
      addToast(`[${schedule.cellName}] 일정이 수정되었습니다.`, 'success');
      setEditingSchedule(null);
    } else {
      setSchedules((prev) => [schedule, ...prev]);
      addToast(`[${schedule.cellName}] 노방전도 신청이 완료되었습니다!`, 'success');
      setDuplicateSchedule(null);
    }
  };

  // Schedule Delete Handler
  const handleDeleteSchedule = (id: string) => {
    const target = schedules.find((s) => s.id === id);
    setSchedules((prev) => prev.filter((item) => item.id !== id));
    if (selectedDetailSchedule?.id === id) {
      setSelectedDetailSchedule(null);
    }
    addToast(`[${target?.cellName || '일정'}] 일정이 삭제되었습니다.`, 'info');
  };

  // Schedule Edit Handler
  const handleStartEditSchedule = (schedule: EvangelismSchedule) => {
    setEditingSchedule(schedule);
    setDuplicateSchedule(null);
    setSelectedDetailSchedule(null);
    setIsApplyModalOpen(true);
  };

  // Schedule Duplicate Handler (연합 출격 / 일정 복사 신청)
  const handleDuplicateSchedule = (schedule: EvangelismSchedule) => {
    setEditingSchedule(null);
    setDuplicateSchedule(schedule);
    setSelectedDetailSchedule(null);
    setIsApplyModalOpen(true);
    addToast(`[${schedule.cellName}]의 일시 및 장소가 복사되었습니다.`, 'info');
  };

  // Auth request handler from DetailModal
  const handleRequestAuth = (schedule: EvangelismSchedule, action: 'edit' | 'delete') => {
    setAuthTargetSchedule(schedule);
    setAuthActionType(action);
    setIsAuthModalOpen(true);
  };

  // Auth success callback
  const handleAuthSuccess = () => {
    if (authActionType === 'admin-login') {
      setIsAdmin(true);
      addToast('관리자 모드로 전환되었습니다.', 'success');
    } else if (authActionType === 'edit' && authTargetSchedule) {
      handleStartEditSchedule(authTargetSchedule);
    } else if (authActionType === 'delete' && authTargetSchedule) {
      handleDeleteSchedule(authTargetSchedule.id);
    }
  };

  // Admin logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    addToast('관리자 모드가 해제되었습니다.', 'info');
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
      addToast('공유 텍스트가 클립보드에 복사되었습니다.', 'success');
    } catch {
      addToast('클립보드 복사에 실패했습니다.', 'error');
    }
  };

  // Open apply modal for specific date
  const handleOpenApplyModalForDate = (dateStr: string) => {
    setEditingSchedule(null);
    setDuplicateSchedule(null);
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
    setSelectedCorps('');
  };

  return (
    <div className="min-h-screen bg-[#f4f4f5] text-[#18181b] flex flex-col selection:bg-[#18181b] selection:text-[#ffffff]">
      
      {/* Toast Notification */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Header */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenApplyModal={() => {
          setEditingSchedule(null);
          setDuplicateSchedule(null);
          setApplyModalInitialDate(undefined);
          setIsApplyModalOpen(true);
        }}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => {
          setAuthTargetSchedule(null);
          setAuthActionType('admin-login');
          setIsAuthModalOpen(true);
        }}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Area (Max width 1240px) */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-12 sm:pb-16">
        
        {/* Statistics & Overview Banner */}
        <StatsBanner
          schedules={filteredSchedules}
          currentDate={currentDate}
          onSelectSchedule={(s) => setSelectedDetailSchedule(s)}
          isAdmin={isAdmin}
        />

        {/* Search & Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedCell={selectedCell}
          onSelectedCellChange={setSelectedCell}
          selectedCorps={selectedCorps}
          onSelectedCorpsChange={setSelectedCorps}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredSchedules.length}
          availableCells={availableCells}
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

      {/* Mobile Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-5 z-40 sm:hidden">
        <button
          type="button"
          onClick={() => {
            setEditingSchedule(null);
            setDuplicateSchedule(null);
            setApplyModalInitialDate(undefined);
            setIsApplyModalOpen(true);
          }}
          className="w-12 h-12 bg-[#09090b] text-[#ffffff] rounded-full flex items-center justify-center border-2 border-[#ffffff] shadow-xl active:scale-90 transition-transform cursor-pointer"
          title="새 노방전도 신청"
        >
          <Plus className="w-5 h-5 text-[#ffffff]" />
        </button>
      </div>


      {/* Application / Edit Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => {
          setIsApplyModalOpen(false);
          setEditingSchedule(null);
          setDuplicateSchedule(null);
        }}
        onSave={handleSaveSchedule}
        initialDate={applyModalInitialDate}
        editSchedule={editingSchedule}
        duplicateSchedule={duplicateSchedule}
      />

      {/* Detail Modal */}
      <DetailModal
        schedule={selectedDetailSchedule}
        onClose={() => setSelectedDetailSchedule(null)}
        isAdmin={isAdmin}
        onEdit={handleStartEditSchedule}
        onDelete={handleDeleteSchedule}
        onRequestAuth={handleRequestAuth}
        onCopyShareText={handleCopyShareText}
        onDuplicateSchedule={handleDuplicateSchedule}
      />

      {/* Password Authentication Modal */}
      <AuthPasswordModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthTargetSchedule(null);
        }}
        targetSchedule={authTargetSchedule}
        actionType={authActionType}
        isAdmin={isAdmin}
        onSuccess={handleAuthSuccess}
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
