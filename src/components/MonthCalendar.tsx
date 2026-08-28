import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, ArrowRight, Calendar as CalIcon } from 'lucide-react';
import type { EvangelismSchedule, CalendarDay } from '../types';
import { KOREAN_DAYS, formatDateFullKorean } from '../utils/dateUtils';
import { CELL_COLORS } from '../data/presetData';
import { format } from 'date-fns';

interface MonthCalendarProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  calendarDays: CalendarDay[];
  onSelectSchedule: (schedule: EvangelismSchedule) => void;
  onOpenApplyModalForDate: (dateStr: string) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  calendarDays,
  onSelectSchedule,
  onOpenApplyModalForDate,
}) => {
  // Selected date on mobile/desktop (default today)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // 🎚️ Week Interval / Height Slider (사진과 같은 주간격 조절 슬라이더)
  const totalWeeks = Math.ceil(calendarDays.length / 7) || 6;
  const [visibleWeeks, setVisibleWeeks] = useState<number>(totalWeeks);

  // Dynamic cell minimum height based on visible weeks slider
  const getCellMinHeight = () => {
    switch (visibleWeeks) {
      case 1:
        return 'min-h-[300px] sm:min-h-[380px]';
      case 2:
        return 'min-h-[220px] sm:min-h-[280px]';
      case 3:
        return 'min-h-[170px] sm:min-h-[220px]';
      case 4:
        return 'min-h-[130px] sm:min-h-[180px]';
      case 5:
        return 'min-h-[105px] sm:min-h-[155px]';
      case 6:
      default:
        return 'min-h-[88px] sm:min-h-[140px]';
    }
  };

  // 📱 Touch Swipe Handlers for Month Navigation
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 40; // minimum swipe distance in px

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null || touchStartY === null || touchEndY === null) return;
    
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    
    // Check if movement is primarily horizontal (not vertical scrolling)
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY) * 1.1;

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        // Swiped Left -> Next Month
        onNextMonth();
      } else {
        // Swiped Right -> Previous Month
        onPrevMonth();
      }
    }

    // Reset coordinates
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchEndX(null);
    setTouchEndY(null);
  };

  const selectedDayEvents = calendarDays.find((d) => d.dateString === selectedDateStr)?.events || [];

  return (
    <div className="space-y-4">
      
      {/* 📅 Main Calendar Grid Card with Touch Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="bg-[#ffffff] rounded-[28px] sm:rounded-[36px] border border-[#ececee] overflow-hidden select-none transition-all shadow-xs"
      >
        
        {/* 📌 Sticky Month Header + Weekday Bar (달력 보는 동안 상단 고정) */}
        <div className="sticky top-[70px] sm:top-[68px] z-20 bg-[#ffffff]/98 backdrop-blur-md border-b border-[#ececee] transition-all">
          
          {/* Month Calendar Navigation Header */}
          <div className="p-3.5 sm:p-5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-2xl font-bold text-[#09090b] tracking-tight">
                {format(currentDate, 'yyyy년 M월')}
              </h2>
              <button
                type="button"
                onClick={() => {
                  onToday();
                  setSelectedDateStr(todayStr);
                }}
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-[#18181b] bg-[#f4f4f5] hover:bg-[#ececee] rounded-[10000px] border border-[#ececee] transition-colors cursor-pointer"
              >
                오늘
              </button>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="sm:hidden text-[10px] text-[#71717a] font-medium flex items-center gap-1 bg-[#f4f4f5] px-2 py-1 rounded-[10000px] border border-[#ececee] whitespace-nowrap">
                👈 스와이프 이동 👉
              </span>

              {/* Month Navigation Arrows */}
              <div className="flex items-center gap-0.5 sm:gap-1 bg-[#f4f4f5] p-0.5 sm:p-1 rounded-[12px] sm:rounded-[14px] border border-[#ececee]">
                <button
                  type="button"
                  onClick={onPrevMonth}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-[8px] sm:rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
                  title="이전 달"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">이전 달</span>
                </button>
                <button
                  type="button"
                  onClick={onNextMonth}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-[8px] sm:rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
                  title="다음 달"
                >
                  <span className="hidden sm:inline">다음 달</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Weekday Header (일 ~ 토) */}
          <div className="grid grid-cols-7 border-t border-[#ececee] bg-[#fafafa]/80 text-center py-2 text-[11px] sm:text-xs font-bold">
            {KOREAN_DAYS.map((day, idx) => {
              const isSun = idx === 0;
              const isSat = idx === 6;
              return (
                <div
                  key={day}
                  className={`${
                    isSun
                      ? 'text-rose-600'
                      : isSat
                      ? 'text-blue-600'
                      : 'text-[#71717a]'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-[#ececee] gap-px">
          {calendarDays.map((day) => {
            const isSun = day.isSunday;
            const isSat = day.isSaturday;
            const isSelected = day.dateString === selectedDateStr;
            const cellMinH = getCellMinHeight();

            return (
              <div
                key={day.dateString}
                onClick={() => setSelectedDateStr(day.dateString)}
                className={`${cellMinH} p-1 sm:p-2 bg-[#ffffff] transition-all relative flex flex-col justify-between cursor-pointer group overflow-hidden ${
                  !day.isCurrentMonth
                    ? 'bg-[#fafafa] text-[#a1a1aa]'
                    : 'bg-[#ffffff] text-[#18181b]'
                } ${
                  isSelected
                    ? 'ring-2 ring-inset ring-[#09090b] bg-[#f4f4f5] z-10'
                    : day.isToday
                    ? 'ring-1.5 ring-inset ring-[#09090b] bg-[#f4f4f5]/60'
                    : 'hover:bg-[#fafafa]'
                }`}
              >
                {/* Day Top Bar */}
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span
                      className={`inline-flex items-center justify-center text-[11px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-[10000px] shrink-0 transition-all ${
                        day.isToday
                          ? 'bg-[#09090b] text-[#ffffff] shadow-2xs'
                          : !day.isCurrentMonth
                          ? 'text-[#a1a1aa]'
                          : isSun
                          ? 'text-rose-600'
                          : isSat
                          ? 'text-blue-600'
                          : 'text-[#18181b]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>
                    {day.isToday && (
                      <span className="hidden sm:inline-block text-[10px] font-extrabold text-[#ff5a00] tracking-wider truncate">
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button */}
                  {day.isCurrentMonth && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenApplyModalForDate(day.dateString);
                      }}
                      className="hidden sm:flex opacity-0 group-hover:opacity-100 p-0.5 text-[#71717a] hover:text-[#09090b] hover:bg-[#ececee] rounded-[6px] transition-all cursor-pointer"
                      title={`${day.dateString} 신청하기`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* --- Multiple Event Badges (하루에 여러 개 일정이 줄줄이 잘 보이도록 렌더링) --- */}
                <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 mt-0.5 overflow-y-auto max-h-[140px] pr-0.5">
                  {day.events.map((schedule) => {
                    const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
                    return (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSchedule(schedule);
                        }}
                        className={`px-1 py-0.5 sm:px-1.5 sm:py-1 rounded-[5px] sm:rounded-[7px] border text-[9px] sm:text-[11px] font-bold leading-tight truncate flex items-center justify-between gap-0.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-2xs ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                        title={`${schedule.cellName} | ${schedule.startTime}~${schedule.endTime} | ${schedule.location} (${schedule.participantCount}명)`}
                      >
                        <span className="truncate">{schedule.cellName}</span>
                        <span className="text-[8px] sm:text-[9px] font-mono opacity-85 shrink-0 hidden xs:inline sm:inline">
                          {schedule.startTime}
                        </span>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

        {/* 🎚️ Bottom Week View Interval Slider (사진 UI 반영: 6주 ~ 1주 슬라이더 바) */}
        <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-[#ffffff] border-t border-[#ececee] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs sm:text-sm font-bold text-[#09090b] w-8 sm:w-10">
              {visibleWeeks}주
            </span>
          </div>

          <div className="flex-1 max-w-[280px] sm:max-w-[360px] flex items-center gap-2">
            <input
              type="range"
              min={1}
              max={totalWeeks}
              step={1}
              value={visibleWeeks}
              onChange={(e) => setVisibleWeeks(Number(e.target.value))}
              className="w-full h-1.5 bg-[#e4e4e7] rounded-lg appearance-none cursor-pointer accent-[#09090b]"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setVisibleWeeks(totalWeeks)}
              className={`px-2 py-1 text-[11px] font-medium rounded-[8px] border transition-colors cursor-pointer ${
                visibleWeeks === totalWeeks
                  ? 'bg-[#09090b] text-[#ffffff] border-[#09090b]'
                  : 'bg-[#f4f4f5] text-[#71717a] border-[#ececee] hover:text-[#09090b]'
              }`}
            >
              전체
            </button>
            <button
              type="button"
              onClick={() => setVisibleWeeks(visibleWeeks <= 3 ? totalWeeks : 3)}
              className={`px-2 py-1 text-[11px] font-medium rounded-[8px] border transition-colors cursor-pointer ${
                visibleWeeks < totalWeeks
                  ? 'bg-[#09090b] text-[#ffffff] border-[#09090b]'
                  : 'bg-[#f4f4f5] text-[#71717a] border-[#ececee] hover:text-[#09090b]'
              }`}
            >
              {visibleWeeks <= 3 ? '기본' : '확대'}
            </button>
          </div>
        </div>

      </div>

      {/* 📱 Selected Date Detail Panel */}
      <div className="bg-[#ffffff] rounded-[28px] border border-[#ececee] p-5 sm:p-6">
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#ececee]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[12px] bg-[#09090b] text-[#ffffff] flex items-center justify-center text-xs font-bold">
              <CalIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#09090b]">
                {formatDateFullKorean(selectedDateStr)}
              </h3>
              <p className="text-xs text-[#71717a]">
                {selectedDayEvents.length > 0
                  ? `총 ${selectedDayEvents.length}개 셀의 전도 일정이 있습니다`
                  : '등록된 일정이 없습니다'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenApplyModalForDate(selectedDateStr)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#ffffff] bg-[#09090b] hover:bg-[#18181b] rounded-[12px] border border-[#27272a] transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>이 날짜 신청</span>
          </button>
        </div>

        {/* Selected Date Events List */}
        {selectedDayEvents.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#71717a] bg-[#f4f4f5] rounded-[20px] border border-[#ececee]">
            <p>이 날짜에 신청된 노방전도 일정이 없습니다.</p>
            <button
              type="button"
              onClick={() => onOpenApplyModalForDate(selectedDateStr)}
              className="mt-2 text-xs font-bold text-[#09090b] hover:text-[#ff5a00] underline underline-offset-2 transition-colors cursor-pointer"
            >
              우리 셀 전도 일정 등록하기 +
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDayEvents.map((schedule) => {
              const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
              return (
                <div
                  key={schedule.id}
                  onClick={() => onSelectSchedule(schedule)}
                  className={`p-4 rounded-[20px] border text-left cursor-pointer transition-all hover:scale-[1.01] shadow-2xs ${colorTheme.bg} ${colorTheme.border}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-[10000px] text-xs font-bold ${colorTheme.badge}`}>
                        {schedule.cellName}
                      </span>
                      {schedule.corpsName && (
                        <span className="text-xs text-[#71717a] font-medium">({schedule.corpsName})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#09090b] bg-[#ffffff] px-2 py-0.5 rounded-[8px] border border-[#ececee]">
                      <Clock className="w-3 h-3 text-[#71717a]" />
                      <span>{schedule.startTime} ~ {schedule.endTime}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#52525b]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="text-[#09090b] font-bold">{schedule.location}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#71717a] pt-1">
                      <span className="flex items-center gap-1 font-semibold text-[#18181b]">
                        <Users className="w-3.5 h-3.5 text-emerald-600" /> 참여 {schedule.participantCount}명 ({schedule.cellLeader})
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#09090b] font-bold hover:text-[#ff5a00]">
                        <span>상세보기</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
