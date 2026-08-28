import React from 'react';
import { ChevronLeft, ChevronRight, Plus, Users, MapPin } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
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
    <div className="bg-[#ffffff] rounded-[36px] border border-[#ececee] overflow-hidden">
      
      {/* Week Navigation Header */}
      <div className="p-5 sm:p-6 border-b border-[#ececee] flex flex-wrap items-center justify-between gap-3 bg-[#ffffff]">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold text-[#09090b] tracking-tight">
            {format(weekStart, 'M월 d일')} ~ {format(weekEnd, 'M월 d일')} 주간 일정
          </h2>
          <button
            type="button"
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-medium text-[#18181b] bg-[#f4f4f5] hover:bg-[#ececee] rounded-[10000px] border border-[#ececee] transition-colors cursor-pointer"
          >
            이번 주
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-[14px] border border-[#ececee]">
          <button
            type="button"
            onClick={handlePrevWeek}
            className="px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
            title="이전 주"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">이전 주</span>
          </button>
          <button
            type="button"
            onClick={handleNextWeek}
            className="px-3 py-1.5 rounded-[10px] text-xs font-medium text-[#18181b] hover:bg-[#ffffff] hover:border hover:border-[#ececee] transition-all flex items-center gap-1 cursor-pointer"
            title="다음 주"
          >
            <span className="hidden sm:inline">다음 주</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Week Days Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[#ececee] min-h-[500px]">
        {weekDays.map((day, idx) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayToday = isToday(day);
          const isSun = idx === 0;

          const dayEvents = schedules
            .filter((s) => s.date === dateStr)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={dateStr}
              className={`p-3 sm:p-4 flex flex-col justify-between ${
                dayToday ? 'bg-[#f4f4f5]/60' : 'bg-[#ffffff]'
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#ececee]">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-medium ${
                        isSun ? 'text-[#ff5a00]' : 'text-[#71717a]'
                      }`}
                    >
                      {getDayOfWeekKorean(day)}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center text-xs font-semibold w-6 h-6 rounded-[10000px] ${
                        dayToday
                          ? 'bg-[#09090b] text-[#ffffff]'
                          : 'text-[#18181b]'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenApplyModalForDate(dateStr)}
                    className="p-1 text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] rounded-[10px] transition-colors cursor-pointer"
                    title={`${dateStr} 신청하기`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Day Events */}
                <div className="mt-3 flex flex-col gap-2">
                  {dayEvents.length === 0 ? (
                    <div className="py-8 text-center text-[#a1a1aa] text-xs">
                      일정 없음
                    </div>
                  ) : (
                    dayEvents.map((schedule) => {
                      return (
                        <div
                          key={schedule.id}
                          onClick={() => onSelectSchedule(schedule)}
                          className="p-2.5 rounded-[16px] border border-[#ececee] bg-[#ffffff] hover:bg-[#f4f4f5] text-left cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-semibold text-xs text-[#09090b] truncate">
                              {schedule.cellName}
                            </span>
                            <span className="text-[10px] text-[#71717a] shrink-0">
                              {schedule.startTime}
                            </span>
                          </div>

                          <div className="mt-1.5 space-y-0.5 text-[11px] text-[#52525b]">
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 shrink-0 text-[#71717a]" />
                              <span className="truncate">{schedule.location}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-[#71717a]">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" /> {schedule.participantCount}명
                              </span>
                              <span>{schedule.cellLeader}</span>
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
                className="mt-3 py-1.5 px-2 w-full text-xs font-medium text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] rounded-[12px] border border-[#ececee] transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>신청</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
