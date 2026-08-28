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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Month Calendar Navigation Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {format(currentDate, 'yyyy년 M월')}
          </h2>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-colors cursor-pointer"
          >
            오늘
          </button>
        </div>

        {/* Month Navigation Arrows */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
            title="다음 달"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Header (일 ~ 토) */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/60 text-center py-2.5 text-xs font-semibold">
        {KOREAN_DAYS.map((day, idx) => {
          const isSun = idx === 0;
          const isSat = idx === 6;
          return (
            <div
              key={day}
              className={`${
                isSun ? 'text-rose-500' : isSat ? 'text-blue-500' : 'text-slate-500'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-slate-100 gap-px">
        {calendarDays.map((day) => {
          const isSun = day.isSunday;
          const isSat = day.isSaturday;

          return (
            <div
              key={day.dateString}
              className={`min-h-[115px] sm:min-h-[135px] p-1.5 sm:p-2.5 bg-white transition-colors relative flex flex-col justify-between group ${
                !day.isCurrentMonth ? 'bg-slate-50/40 text-slate-300' : 'text-slate-800'
              } ${day.isToday ? 'ring-2 ring-inset ring-blue-500/80 bg-blue-50/20' : ''}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`inline-flex items-center justify-center text-xs font-bold w-6 h-6 rounded-full transition-all ${
                    day.isToday
                      ? 'bg-blue-600 text-white shadow-xs'
                      : !day.isCurrentMonth
                      ? 'text-slate-300'
                      : isSun
                      ? 'text-rose-600'
                      : isSat
                      ? 'text-blue-600'
                      : 'text-slate-700'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* Quick Add Button on Day Hover */}
                {day.isCurrentMonth && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenApplyModalForDate(day.dateString);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
                    title={`${day.dateString} 신청하기`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Day Events Container */}
              <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[85px] sm:max-h-[95px] pr-0.5">
                {day.events.map((schedule) => {
                  const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => onSelectSchedule(schedule)}
                      className={`text-left px-2 py-1 rounded-lg border text-[11px] leading-tight cursor-pointer transition-all hover:scale-[1.02] shadow-xs ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                      title={`${schedule.cellName} | ${schedule.startTime}~${schedule.endTime} | ${schedule.location} (${schedule.participantCount}명)`}
                    >
                      <div className="flex items-center justify-between gap-1 font-semibold">
                        <span className="truncate">{schedule.cellName}</span>
                        <span className="text-[10px] opacity-80 shrink-0">{schedule.startTime}</span>
                      </div>
                      <div className="hidden sm:flex items-center justify-between text-[10px] opacity-90 mt-0.5">
                        <span className="truncate max-w-[70px]">{schedule.location}</span>
                        <span className="shrink-0 font-medium">👥 {schedule.participantCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom indicator for mobile if count > 0 */}
              {day.events.length > 0 && (
                <div className="sm:hidden text-[9px] text-slate-400 font-medium text-right mt-1">
                  {day.events.length}개 일정
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
