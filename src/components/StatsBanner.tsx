import React from 'react';
import { Users, Clock, Flame, CalendarCheck2, MapPin, ArrowRight, Sparkles, Trophy, ShieldCheck } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { formatDurationString, getDDayString } from '../utils/dateUtils';
import { CORPS_PRESETS } from '../data/presetData';
import { parseISO, isSameMonth } from 'date-fns';

interface StatsBannerProps {
  schedules: EvangelismSchedule[];
  currentDate: Date;
  onSelectSchedule: (schedule: EvangelismSchedule) => void;
  isAdmin?: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  schedules,
  currentDate,
  onSelectSchedule,
  isAdmin = false,
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

  let topLocation = '마곡역';
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

  // Calculate corps activity ranking (Admin only)
  const corpsStats: { [name: string]: { count: number; participants: number } } = {};
  CORPS_PRESETS.forEach((c) => {
    corpsStats[c] = { count: 0, participants: 0 };
  });

  schedules.forEach((s) => {
    const cName = s.corpsName || '김태홍 군단';
    if (!corpsStats[cName]) {
      corpsStats[cName] = { count: 0, participants: 0 };
    }
    corpsStats[cName].count += 1;
    corpsStats[cName].participants += (s.participantCount || 0);
  });

  const maxCorpsCount = Math.max(...Object.values(corpsStats).map((v) => v.count), 1);

  return (
    <div className="space-y-4 mb-6">
      
      {/* 🌟 Top Scripture Banner (오직 성령이 너희에게 임하시면...) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white p-4 sm:p-5 shadow-lg shadow-blue-500/15 border border-blue-400/30">
        {/* Background glow circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-10 w-32 h-32 bg-indigo-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-center gap-3 sm:gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xs shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
            "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅끝까지 이르러 내 증인이 되리라 하시니라 (사도행전 1:8)"
          </p>
        </div>
      </div>

      {/* 📊 5 Key Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* 1. This Month Total Sessions */}
        <div className="relative group bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 hover:border-blue-300 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">이달의 전도 출격</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalEvents}</span>
            <span className="text-xs font-bold text-slate-400">회</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">이번 달 확정된 셀 전도</p>
        </div>

        {/* 2. Total Participants */}
        <div className="relative group bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">누적 참여 성도</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalParticipants}</span>
            <span className="text-xs font-bold text-slate-400">명</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">셀원들의 열정적인 동참</p>
        </div>

        {/* 3. Total Evangelism Hours */}
        <div className="relative group bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 hover:border-violet-300 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">총 전도 시간</span>
            <div className="w-9 h-9 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {Math.floor(totalMinutes / 60)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              시간 {totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">
            {totalMinutes > 0 ? formatDurationString(totalMinutes) : '일정 대기 중'}
          </p>
        </div>

        {/* 4. Top Location */}
        <div className="relative group bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200/80 hover:border-amber-300 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">인기 전도 구역</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-sm sm:text-base font-bold text-slate-900 truncate" title={topLocation}>
              {topLocation}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">
              {maxCount > 0 ? `이달 ${maxCount}회 출격 거점` : '데이터 수집 중'}
            </p>
          </div>
        </div>

        {/* 5. Next Upcoming Schedule Feature (Spotlight Card) */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 p-4 rounded-3xl text-white shadow-md shadow-indigo-500/20 flex flex-col justify-between group">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-100 flex items-center gap-1">
                <span>다음 출격</span>
              </span>
              {nextUpcoming && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/20 text-white backdrop-blur-md animate-pulse">
                  {getDDayString(nextUpcoming.date).label}
                </span>
              )}
            </div>
            {nextUpcoming ? (
              <div className="mt-2">
                <p className="text-base font-bold text-white tracking-tight flex items-center gap-1.5 truncate">
                  <span>{nextUpcoming.cellName}</span>
                  {nextUpcoming.corpsName && (
                    <span className="text-xs font-normal text-indigo-200">({nextUpcoming.corpsName})</span>
                  )}
                </p>
                <p className="text-xs text-indigo-100 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 shrink-0 text-indigo-300" />
                  <span className="truncate">{nextUpcoming.location} ({nextUpcoming.participantCount}명)</span>
                </p>
                <p className="text-[11px] text-indigo-200 mt-0.5 font-medium">
                  {nextUpcoming.date} {nextUpcoming.startTime}
                </p>
              </div>
            ) : (
              <p className="text-xs text-indigo-100 mt-2 font-medium">
                예정된 다음 일정이 없습니다.
              </p>
            )}
          </div>

          {nextUpcoming && (
            <button
              onClick={() => onSelectSchedule(nextUpcoming)}
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white/95 hover:text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-xl transition-all self-end cursor-pointer"
            >
              <span>상세보기</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

      </div>

      {/* 🎖️ Corps Activity Race (군단별 전도 활성도 현황판 - 관리자 전용) */}
      {isAdmin && (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <span>군단별 전도 출격 현황</span>
                <span className="px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-md border border-emerald-200 flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" /> 관리자 전용
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">
                (전체 {schedules.length}회 출격)
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              * 각 군단 소속 셀들의 전도 일정이 실시간으로 합산됩니다
            </span>
          </div>

          {/* Corps Progress Bars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CORPS_PRESETS.map((corpsName, idx) => {
              const stat = corpsStats[corpsName] || { count: 0, participants: 0 };
              const percentage = maxCorpsCount > 0 ? Math.round((stat.count / maxCorpsCount) * 100) : 0;

              const badgeColors = [
                'bg-blue-500',
                'bg-indigo-500',
                'bg-violet-500',
                'bg-emerald-500',
                'bg-amber-500',
                'bg-rose-500',
                'bg-cyan-500',
              ];
              const barColor = badgeColors[idx % badgeColors.length];

              return (
                <div
                  key={corpsName}
                  className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200/60 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${barColor}`} />
                      <span>{corpsName}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-600">
                      <strong className="text-blue-600">{stat.count}</strong>회 <span className="text-slate-400 font-normal">({stat.participants}명)</span>
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, stat.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
