import React from 'react';
import { Users, Clock, Flame, CalendarCheck2, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
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
      
      {/* 🌟 Awesomic Editorial Hero Card (Pure Typography, 36px radius, Hairline Border) */}
      <div className="bg-[#ffffff] rounded-[36px] border border-[#ececee] p-6 sm:p-10 transition-all">
        
        {/* Top Tag Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-[12px] bg-[#ff5a00] text-[#ffffff] text-xs font-semibold tracking-wide">
            사도행전 1:8
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-[12px] bg-[#f4f4f5] text-[#18181b] border border-[#ececee] text-xs font-normal">
            뉴스통신 노방전도 비전
          </span>
          <span className="text-xs text-[#71717a] ml-auto hidden sm:inline">
            NEWSOUND CHURCH STREET EVANGELISM
          </span>
        </div>

        {/* Big Bold Display Headline (Cosmica editorial weight 600) */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-semibold text-[#09090b] leading-[1.22] tracking-tight text-balance">
          “ 오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅끝까지 이르러 내 증인이 되리라 하시니라 ”
        </h2>

        {/* Supporting Meta */}
        <div className="mt-5 pt-4 border-t border-[#ececee] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-[#52525b]">
          <p>
            성령의 능력으로 거리에 나가 복음의 빛을 비추는 뉴사운드교회 청년부 사역
          </p>
          <div className="flex items-center gap-3 text-xs text-[#71717a]">
            <span>마곡역 · 롯데리아 앞 거점</span>
            <span>•</span>
            <span>2026 청년부 연합</span>
          </div>
        </div>

      </div>

      {/* 📊 Awesomic Stats Grid (36px rounded cards on canvas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* 1. This Month Total Sessions */}
        <div className="bg-[#ffffff] rounded-[28px] border border-[#ececee] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717a]">이달의 전도 출격</span>
            <div className="w-8 h-8 rounded-[12px] bg-[#f4f4f5] text-[#18181b] border border-[#ececee] flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-semibold text-[#09090b] tracking-tight">{totalEvents}</span>
            <span className="text-sm font-medium text-[#71717a]">회</span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">이번 달 확정된 셀 일정</p>
        </div>

        {/* 2. Total Participants */}
        <div className="bg-[#ffffff] rounded-[28px] border border-[#ececee] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717a]">누적 참여 성도</span>
            <div className="w-8 h-8 rounded-[12px] bg-[#f4f4f5] text-[#18181b] border border-[#ececee] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-semibold text-[#09090b] tracking-tight">{totalParticipants}</span>
            <span className="text-sm font-medium text-[#71717a]">명</span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">셀원들의 열정적인 동참</p>
        </div>

        {/* 3. Total Evangelism Hours */}
        <div className="bg-[#ffffff] rounded-[28px] border border-[#ececee] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717a]">총 전도 시간</span>
            <div className="w-8 h-8 rounded-[12px] bg-[#f4f4f5] text-[#18181b] border border-[#ececee] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-semibold text-[#09090b] tracking-tight">
              {Math.floor(totalMinutes / 60)}
            </span>
            <span className="text-sm font-medium text-[#71717a]">
              시간 {totalMinutes % 60 > 0 ? `${totalMinutes % 60}분` : ''}
            </span>
          </div>
          <p className="text-xs text-[#a1a1aa] mt-1">
            {totalMinutes > 0 ? formatDurationString(totalMinutes) : '일정 대기 중'}
          </p>
        </div>

        {/* 4. Top Location */}
        <div className="bg-[#ffffff] rounded-[28px] border border-[#ececee] p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#71717a]">인기 전도 구역</span>
            <div className="w-8 h-8 rounded-[12px] bg-[#f4f4f5] text-[#18181b] border border-[#ececee] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-base font-semibold text-[#09090b] truncate" title={topLocation}>
              {topLocation}
            </p>
            <p className="text-xs text-[#a1a1aa] mt-1">
              {maxCount > 0 ? `이달 ${maxCount}회 출격 거점` : '데이터 수집 중'}
            </p>
          </div>
        </div>

        {/* 5. Dark Feature Card (Next Upcoming Schedule) */}
        <div className="bg-[#18181b] rounded-[28px] p-5 text-[#ffffff] flex flex-col justify-between border border-[#27272a]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#a1a1aa]">다음 출격</span>
              {nextUpcoming && (
                <span className="px-2 py-0.5 rounded-[12px] text-[11px] font-semibold bg-[#ff5a00] text-[#ffffff]">
                  {getDDayString(nextUpcoming.date).label}
                </span>
              )}
            </div>
            {nextUpcoming ? (
              <div className="mt-2.5">
                <p className="text-base font-semibold text-[#ffffff] tracking-tight truncate">
                  {nextUpcoming.cellName}
                  {nextUpcoming.corpsName && (
                    <span className="text-xs font-normal text-[#a1a1aa] ml-1">({nextUpcoming.corpsName})</span>
                  )}
                </p>
                <p className="text-xs text-[#d4d4d8] flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0 text-[#ff5a00]" />
                  <span className="truncate">{nextUpcoming.location} ({nextUpcoming.participantCount}명)</span>
                </p>
                <p className="text-[11px] text-[#71717a] mt-0.5">
                  {nextUpcoming.date} {nextUpcoming.startTime}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[#71717a] mt-2.5">
                예정된 다음 일정이 없습니다.
              </p>
            )}
          </div>

          {nextUpcoming && (
            <button
              onClick={() => onSelectSchedule(nextUpcoming)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[#ffffff] hover:text-[#ff5a00] transition-colors self-end cursor-pointer"
            >
              <span>상세보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* 🎖️ Corps Activity Race (군단별 전도 활성도 - 관리자 전용) */}
      {isAdmin && (
        <div className="bg-[#ffffff] rounded-[36px] p-6 border border-[#ececee]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#ececee]">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#09090b] flex items-center gap-2">
                <span>군단별 전도 출격 현황</span>
                <span className="px-2 py-0.5 text-[11px] font-medium text-[#18181b] bg-[#f4f4f5] rounded-[10000px] border border-[#ececee] flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#ff5a00]" /> 관리자 전용
                </span>
              </h3>
              <span className="text-xs text-[#71717a]">
                (총 {schedules.length}회 출격)
              </span>
            </div>
            <span className="text-xs text-[#a1a1aa]">
              * 각 군단 소속 셀들의 전도 일정이 실시간으로 합산됩니다
            </span>
          </div>

          {/* Corps Progress Bars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CORPS_PRESETS.map((corpsName) => {
              const stat = corpsStats[corpsName] || { count: 0, participants: 0 };
              const percentage = maxCorpsCount > 0 ? Math.round((stat.count / maxCorpsCount) * 100) : 0;

              return (
                <div
                  key={corpsName}
                  className="p-3.5 rounded-[20px] bg-[#f4f4f5] border border-[#ececee]"
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-[#09090b]">{corpsName}</span>
                    <span className="text-xs text-[#52525b]">
                      <strong className="text-[#09090b] font-semibold">{stat.count}</strong>회 <span className="text-[#71717a]">({stat.participants}명)</span>
                    </span>
                  </div>
                  
                  {/* Hairline Progress Bar */}
                  <div className="w-full bg-[#e4e4e7] rounded-[10000px] h-2 overflow-hidden">
                    <div
                      className="h-full rounded-[10000px] bg-[#09090b] transition-all duration-500"
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
