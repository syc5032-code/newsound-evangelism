import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon } from 'lucide-react';
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
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Month Calendar Navigation Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 via-white to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <CalIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {format(currentDate, 'yyyy년 M월')}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              날짜를 누르면 세부 일정을 확인하거나 바로 신청할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onToday}
            className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/60 transition-colors shadow-xs cursor-pointer ml-1"
          >
            오늘
          </button>
        </div>

        {/* Month Navigation Arrows */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={onPrevMonth}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1 cursor-pointer"
            title="이전 달"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전 달</span>
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1 cursor-pointer"
            title="다음 달"
          >
            <span className="hidden sm:inline">다음 달</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Header (일 ~ 토) */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/80 text-center py-3 text-xs font-bold">
        {KOREAN_DAYS.map((day, idx) => {
          const isSun = idx === 0;
          const isSat = idx === 6;
          return (
            <div
              key={day}
              className={`${
                isSun
                  ? 'text-rose-500 font-black'
                  : isSat
                  ? 'text-blue-500 font-black'
                  : 'text-slate-500'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-slate-200/60 gap-px">
        {calendarDays.map((day) => {
          const isSun = day.isSunday;
          const isSat = day.isSaturday;

          return (
            <div
              key={day.dateString}
              className={`min-h-[120px] sm:min-h-[145px] p-2 sm:p-2.5 bg-white transition-all relative flex flex-col justify-between group ${
                !day.isCurrentMonth
                  ? 'bg-slate-50/40 text-slate-300'
                  : isSun
                  ? 'bg-rose-50/15'
                  : isSat
                  ? 'bg-blue-50/15'
                  : ''
              } ${
                day.isToday
                  ? 'ring-2 ring-inset ring-blue-500 bg-gradient-to-b from-blue-50/40 to-indigo-50/20'
                  : 'hover:bg-slate-50/80'
              }`}
            >
              {/* Day Top Bar */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <span
                    className={`inline-flex items-center justify-center text-xs font-black w-6 h-6 rounded-full transition-all ${
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
                  {day.isToday && (
                    <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-100/80 px-1.5 py-0.2 rounded-full">
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
                    className="opacity-0 group-hover:opacity-100 px-1.5 py-0.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/60 transition-all cursor-pointer flex items-center gap-0.5 shadow-xs"
                    title={`${day.dateString} 신청하기`}
                  >
                    <Plus className="w-3 h-3" />
                    <span className="hidden md:inline">신청</span>
                  </button>
                )}
              </div>

              {/* Day Events Container */}
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto max-h-[90px] sm:max-h-[105px] pr-0.5">
                {day.events.map((schedule) => {
                  const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;

                  return (
                    <div
                      key={schedule.id}
                      onClick={() => onSelectSchedule(schedule)}
                      className={`text-left p-1.5 rounded-xl border text-[11px] leading-tight cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-98 ${colorTheme.bg} ${colorTheme.border} ${colorTheme.text}`}
                      title={`${schedule.cellName} | ${schedule.startTime}~${schedule.endTime} | ${schedule.location} (${schedule.participantCount}명)`}
                    >
                      <div className="flex items-center justify-between gap-1 font-bold">
                        <span className="truncate">{schedule.cellName}</span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/70 shadow-2xs shrink-0">
                          {schedule.startTime}
                        </span>
                      </div>
                      <div className="hidden sm:flex items-center justify-between text-[10px] opacity-90 mt-1">
                        <span className="truncate max-w-[75px] font-medium">{schedule.location}</span>
                        <span className="shrink-0 font-bold bg-white/60 px-1 rounded-sm">👥 {schedule.participantCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom indicator for mobile if count > 0 */}
              {day.events.length > 0 && (
                <div className="sm:hidden text-[9px] text-slate-400 font-bold text-right mt-1">
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
