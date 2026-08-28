import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { EvangelismSchedule, CalendarDay } from '../types';
import { KOREAN_DAYS } from '../utils/dateUtils';
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
  return (
    <div className="bg-[#ffffff] rounded-[36px] border border-[#ececee] overflow-hidden">
      
      {/* Month Calendar Navigation Header */}
      <div className="p-5 sm:p-6 border-b border-[#ececee] flex flex-wrap items-center justify-between gap-3 bg-[#ffffff]">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#09090b] tracking-tight">
            {format(currentDate, 'yyyy년 M월')}
          </h2>
          <button
            type="button"
            onClick={onToday}
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
            className="px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
            title="이전 달"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">이전 달</span>
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
            title="다음 달"
          >
            <span className="hidden sm:inline">다음 달</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Weekday Header (일 ~ 토, 토요일 파란색 / 일요일 빨간색) */}
      <div className="grid grid-cols-7 border-b border-[#ececee] bg-[#f4f4f5] text-center py-2.5 text-xs font-semibold">
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

          return (
            <div
              key={day.dateString}
              className={`min-h-[125px] sm:min-h-[145px] p-2 sm:p-2.5 bg-[#ffffff] transition-colors relative flex flex-col justify-between group ${
                !day.isCurrentMonth
                  ? 'bg-[#fafafa] text-[#a1a1aa]'
                  : isSun
                  ? 'bg-rose-50/10'
                  : isSat
                  ? 'bg-blue-50/10'
                  : 'text-[#18181b]'
              } ${day.isToday ? 'bg-[#f4f4f5] ring-1 ring-inset ring-[#09090b]' : 'hover:bg-[#fafafa]'}`}
            >
              {/* Day Top Bar */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-[10000px] transition-all ${
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
                    <span className="hidden sm:inline-block text-[10px] font-bold text-[#09090b]">
                      TODAY
                    </span>
                  )}
                </div>

                {/* Quick Add Button on Day Hover */}
                {day.isCurrentMonth && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenApplyModalForDate(day.dateString);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#71717a] hover:text-[#09090b] hover:bg-[#ececee] rounded-[10px] transition-all cursor-pointer"
                    title={`${day.dateString} 신청하기`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Day Events Container with Colored Cell Badges */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[90px] sm:max-h-[105px] pr-0.5">
                {day.events.map((schedule) => {
                  const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => onSelectSchedule(schedule)}
                      className={`text-left p-1.5 sm:p-2 rounded-[12px] border text-[11px] leading-tight cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                      title={`${schedule.cellName} | ${schedule.startTime}~${schedule.endTime} | ${schedule.location} (${schedule.participantCount}명)`}
                    >
                      <div className="flex items-center justify-between gap-1 font-bold">
                        <span className="truncate">{schedule.cellName}</span>
                        <span className="text-[10px] font-mono opacity-80 shrink-0">
                          {schedule.startTime}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center justify-between text-[10px] opacity-90 mt-0.5">
                        <span className="truncate max-w-[75px] font-medium">{schedule.location}</span>
                        <span className="shrink-0 font-semibold">👥 {schedule.participantCount}명</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom indicator for mobile if count > 0 */}
              {day.events.length > 0 && (
                <div className="sm:hidden text-[9px] text-[#71717a] font-medium text-right mt-1">
                  {day.events.length}개 셀
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
