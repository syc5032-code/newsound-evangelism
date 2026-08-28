import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, MapPin, Calendar as CalIcon } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { CELL_COLORS } from '../data/presetData';
import { getDayOfWeekKorean } from '../utils/dateUtils';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isToday,
  addWeeks,
  subWeeks
} from 'date-fns';

interface WeekCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  schedules: EvangelismSchedule[];
  onSelectSchedule: (schedule: EvangelismSchedule) => void;
  onOpenApplyModalForDate: (dateStr: string) => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  currentDate,
  onDateChange,
  schedules,
  onSelectSchedule,
  onOpenApplyModalForDate,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePrevWeek = () => onDateChange(subWeeks(currentDate, 1));
  const handleNextWeek = () => onDateChange(addWeeks(currentDate, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      
      {/* Week Navigation Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-slate-50/50 via-white to-blue-50/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
            <CalIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {format(weekStart, 'M월 d일')} ~ {format(weekEnd, 'M월 d일')} 전도 주간
            </h2>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              이번 주 각 셀의 요일별 출격 일정
            </p>
          </div>
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200/60 transition-colors shadow-xs cursor-pointer ml-1"
          >
            이번 주
          </button>
        </div>

        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/60">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1 cursor-pointer"
            title="이전 주"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전 주</span>
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1 cursor-pointer"
            title="다음 주"
          >
            <span className="hidden sm:inline">다음 주</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Week Days Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-100 min-h-[500px]">
        {weekDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayToday = isToday(day);
          const isSun = idx === 0;
          const isSat = idx === 6;

          const dayEvents = schedules
            .filter((s) => s.date === dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={dateStr}
              className={`p-3 sm:p-4 flex flex-col justify-between transition-all ${
                dayToday ? 'bg-gradient-to-b from-blue-50/40 to-indigo-50/15 ring-1 ring-blue-500/20' : 'bg-white'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black ${
                        isSun ? 'text-rose-500' : isSat ? 'text-blue-500' : 'text-slate-500'
                      }`}
                    >
                      {getDayOfWeekKorean(day)}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center text-xs font-black w-6 h-6 rounded-full ${
                        dayToday
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-800'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenApplyModalForDate(dateStr)}
                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                    title={`${dateStr} 신청하기`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Events */}
                <div className="mt-3 flex flex-col gap-2">
                  {dayEvents.length === 0 ? (
                    <div className="py-8 text-center text-slate-300 text-xs font-medium">
                      일정 없음
                    </div>
                  ) : (
                    dayEvents.map((schedule) => {
                      const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
                      return (
                        <div
                          key={schedule.id}
                          onClick={() => onSelectSchedule(schedule)}
                          className={`p-2.5 rounded-2xl border text-left cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${colorTheme.bg} ${colorTheme.border}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-black text-xs ${colorTheme.text} truncate`}>
                              {schedule.cellName}
                            </span>
                            <span className="text-[10px] text-slate-600 font-mono font-bold bg-white/70 px-1.5 py-0.2 rounded shadow-2xs">
                              {schedule.startTime}
                            </span>
                          </div>

                          <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 shrink-0 text-rose-500" />
                              <span className="truncate font-medium">{schedule.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-bold text-slate-700">
                                <Users className="w-3 h-3 text-emerald-600" /> {schedule.participantCount}명
                              </span>
                              <span className="truncate text-slate-400">({schedule.cellLeader})</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bottom Quick Action */}
              <button
                type="button"
                onClick={() => onOpenApplyModalForDate(dateStr)}
                className="mt-3 py-1.5 px-2 w-full text-[11px] font-bold text-slate-500 hover:text-blue-600 hover:bg-blue-50/80 rounded-xl border border-dashed border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>이 날짜 신청</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
