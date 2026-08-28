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

  const selectedDayEvents = calendarDays.find((d) => d.dateString === selectedDateStr)?.events || [];

  return (
    <div className="space-y-4">
      
      {/* 📅 Main Calendar Grid Card */}
      <div className="bg-[#ffffff] rounded-[28px] sm:rounded-[36px] border border-[#ececee] overflow-hidden">
        
        {/* Month Calendar Navigation Header */}
        <div className="p-4 sm:p-6 border-b border-[#ececee] flex flex-wrap items-center justify-between gap-3 bg-[#ffffff]">
          <div className="flex items-center gap-3">
            <h2 className="text-lg sm:text-2xl font-semibold text-[#09090b] tracking-tight">
              {format(currentDate, 'yyyy년 M월')}
            </h2>
            <button
              type="button"
              onClick={() => {
                onToday();
                setSelectedDateStr(todayStr);
              }}
              className="px-2.5 py-1 text-xs font-medium text-[#18181b] bg-[#f4f4f5] hover:bg-[#ececee] rounded-[10000px] border border-[#ececee] transition-colors cursor-pointer"
            >
              오늘
            </button>
          </div>

          {/* Month Navigation Arrows */}
          <div className="flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-[14px] border border-[#ececee]">
            <button
              type="button"
              onClick={onPrevMonth}
              className="px-2.5 sm:px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
              title="이전 달"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">이전 달</span>
            </button>
            <button
              type="button"
              onClick={onNextMonth}
              className="px-2.5 sm:px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
              title="다음 달"
            >
              <span className="hidden sm:inline">다음 달</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Weekday Header (일 ~ 토) */}
        <div className="grid grid-cols-7 border-b border-[#ececee] bg-[#ffffff] text-center py-2 text-xs font-semibold">
          {KOREAN_DAYS.map((day, idx) => {
            const isSun = idx === 0;
            const isSat = idx === 6;
            return (
              <div
                key={day}
                className={`${
                  isSun
                    ? 'text-rose-600 font-bold'
                    : isSat
                    ? 'text-blue-600 font-bold'
                    : 'text-[#71717a]'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-[#ececee] gap-px">
          {calendarDays.map((day) => {
            const isSun = day.isSunday;
            const isSat = day.isSaturday;
            const isSelected = day.dateString === selectedDateStr;

            return (
              <div
                key={day.dateString}
                onClick={() => setSelectedDateStr(day.dateString)}
                className={`min-h-[76px] sm:min-h-[145px] p-1.5 sm:p-2.5 bg-[#ffffff] transition-colors relative flex flex-col justify-between cursor-pointer group ${
                  !day.isCurrentMonth
                    ? 'bg-[#fafafa] text-[#a1a1aa]'
                    : 'bg-[#ffffff] text-[#18181b]'
                } ${
                  isSelected
                    ? 'ring-2 ring-inset ring-[#09090b] bg-[#f4f4f5] z-10'
                    : day.isToday
                    ? 'ring-1 ring-inset ring-[#71717a] bg-[#f4f4f5]/60'
                    : 'hover:bg-[#fafafa]'
                }`}
              >
                {/* Day Top Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-flex items-center justify-center text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-[10000px] transition-all ${
                        day.isToday
                          ? 'bg-[#09090b] text-[#ffffff]'
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
                      <span className="hidden sm:inline-block text-[10px] font-extrabold text-[#ff5a00] tracking-wider">
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Desktop Quick Add Button */}
                  {day.isCurrentMonth && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenApplyModalForDate(day.dateString);
                      }}
                      className="hidden sm:flex opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-[#09090b] hover:bg-[#ececee] rounded-[8px] transition-all cursor-pointer"
                      title={`${day.dateString} 신청하기`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* --- MOBILE VIEW: Clean Compact Event Badges (sm:hidden) --- */}
                <div className="sm:hidden flex-1 flex flex-col gap-1 mt-1 overflow-hidden">
                  {day.events.slice(0, 2).map((schedule) => {
                    const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
                    return (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSchedule(schedule);
                        }}
                        className={`px-1 py-0.5 rounded-[6px] text-[10px] font-bold truncate leading-tight border ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                        title={schedule.cellName}
                      >
                        {schedule.cellName}
                      </div>
                    );
                  })}
                  {day.events.length > 2 && (
                    <span className="text-[9px] text-[#71717a] font-medium leading-none">
                      +{day.events.length - 2}
                    </span>
                  )}
                </div>

                {/* --- DESKTOP VIEW: Full Event Cards (hidden sm:flex) --- */}
                <div className="hidden sm:flex flex-1 flex-col gap-1.5 overflow-y-auto max-h-[105px] pr-0.5 mt-1.5">
                  {day.events.map((schedule) => {
                    const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;

                    return (
                      <div
                        key={schedule.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSchedule(schedule);
                        }}
                        className={`text-left p-1.5 sm:p-2 rounded-[12px] border text-[11px] leading-tight cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                        title={`${schedule.cellName} | ${schedule.startTime}~${schedule.endTime} | ${schedule.location} (${schedule.participantCount}명)`}
                      >
                        <div className="flex items-center justify-between gap-1 font-bold">
                          <span className="truncate">{schedule.cellName}</span>
                          <span className="text-[10px] font-mono opacity-80 shrink-0">
                            {schedule.startTime}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] opacity-90 mt-0.5">
                          <span className="truncate max-w-[75px] font-medium">{schedule.location}</span>
                          <span className="shrink-0 font-semibold">👥 {schedule.participantCount}명</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
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
