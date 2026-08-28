import React from 'react';
import { Users, Clock, Flame, CalendarCheck2, MapPin, ArrowRight } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { formatDurationString, getDDayString } from '../utils/dateUtils';
import { parseISO, isSameMonth } from 'date-fns';

interface StatsBannerProps {
  schedules: EvangelismSchedule[];
  currentDate: Date;
  onSelectSchedule: (schedule: EvangelismSchedule) => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  schedules,
  currentDate,
  onSelectSchedule,
}) => {
  // Filter for currently viewed month
  const thisMonthSchedules = schedules.filter((s) => {
    try {
      const d = parseISO(s.date);
      return isSameMonth(d, currentDate);
    } catch {
      return false;
    }
  });

  const totalEvents = thisMonthSchedules.length;
  const totalParticipants = thisMonthSchedules.reduce((acc, cur) => acc + (cur.participantCount || 0), 0);
  const totalMinutes = thisMonthSchedules.reduce((acc, cur) => acc + (cur.durationMinutes || 0), 0);

  // Find most frequent location
  const locationCounts: { [key: string]: number } = {};
  thisMonthSchedules.forEach((s) => {
    if (s.location) {
      locationCounts[s.location] = (locationCounts[s.location] || 0) + 1;
    }
  });

  let topLocation = '-';
  let maxCount = 0;
  Object.entries(locationCounts).forEach(([loc, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topLocation = loc;
    }
  });

  // Find next upcoming schedule
  const now = new Date();
  const sortedUpcoming = [...schedules]
    .filter((s) => {
      try {
        const scheduleDate = parseISO(`${s.date}T${s.startTime || '00:00'}`);
        return scheduleDate >= now;
      } catch {
        return false;
      }
    })
    .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

  const nextUpcoming = sortedUpcoming.length > 0 ? sortedUpcoming[0] : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
      
      {/* 1. This Month Total Sessions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">이달의 전도 출격</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{totalEvents}</span>
          <span className="text-xs font-medium text-slate-500">회</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">이번 달 확정된 군단 전도</p>
      </div>

      {/* 2. Total Participants */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">누적 참여 성도</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">{totalParticipants}</span>
          <span className="text-xs font-medium text-slate-500">명</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">군단원들의 열정적인 동참</p>
      </div>

      {/* 3. Total Evangelism Hours */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">총 전도 시간</span>
          <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {Math.floor(totalMinutes / 60)}
          </span>
          <span className="text-xs font-medium text-slate-500">
            시간 {totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ''}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {totalMinutes > 0 ? formatDurationString(totalMinutes) : '일정 대기 중'}
        </p>
      </div>

      {/* 4. Top Location */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">인기 전도 구역</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm font-bold text-slate-900 truncate" title={topLocation}>
            {topLocation}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {maxCount > 0 ? `이달 ${maxCount}회 출격` : '데이터 수집 중'}
          </p>
        </div>
      </div>

      {/* 5. Next Upcoming Schedule Feature */}
      <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl text-white shadow-md shadow-indigo-500/15 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-100">다음 출격 예정</span>
            {nextUpcoming && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                {getDDayString(nextUpcoming.date).label}
              </span>
            )}
          </div>
          {nextUpcoming ? (
            <div className="mt-1.5">
              <p className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>{nextUpcoming.cellName} 군단</span>
                <span className="text-xs font-normal text-indigo-100">({nextUpcoming.participantCount}명)</span>
              </p>
              <p className="text-xs text-indigo-100 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{nextUpcoming.location}</span>
              </p>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                {nextUpcoming.date} {nextUpcoming.startTime}
              </p>
            </div>
          ) : (
            <p className="text-xs text-indigo-100 mt-2">
              예정된 다음 일정이 없습니다.
            </p>
          )}
        </div>

        {nextUpcoming && (
          <button
            onClick={() => onSelectSchedule(nextUpcoming)}
            className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 hover:text-white underline underline-offset-2 transition-colors self-end cursor-pointer"
          >
            <span>상세보기</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

    </div>
  );
};
