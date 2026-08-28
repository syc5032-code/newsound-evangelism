import React from 'react';
import { Clock, Users, MapPin, Phone, MessageSquare, Copy, ChevronRight, Calendar } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { CELL_COLORS } from '../data/presetData';
import { formatDateFullKorean, formatDurationString, getDDayString } from '../utils/dateUtils';

interface ListViewProps {
  schedules: EvangelismSchedule[];
  onSelectSchedule: (schedule: EvangelismSchedule) => void;
  onCopyShareText: (schedule: EvangelismSchedule) => void;
}

export const ListView: React.FC<ListViewProps> = ({
  schedules,
  onSelectSchedule,
  onCopyShareText,
}) => {
  if (schedules.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">조회된 전도 일정이 없습니다</h3>
        <p className="text-xs text-slate-400 mt-1">
          새로운 전도 일정을 신청하거나 검색 필터를 확인해보세요.
        </p>
      </div>
    );
  }

  // Sort chronologically
  const sorted = [...schedules].sort((a, b) =>
    `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)
  );

  return (
    <div className="space-y-3.5">
      {sorted.map((schedule) => {
        const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
        const dDayInfo = getDDayString(schedule.date);
        const durationStr = formatDurationString(schedule.durationMinutes);

        return (
          <div
            key={schedule.id}
            onClick={() => onSelectSchedule(schedule)}
            className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              
              {/* Corps & Date Header */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold ${colorTheme.badge}`}>
                  {schedule.cellName} 군단
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {formatDateFullKorean(schedule.date)}
                </span>
              </div>

              {/* D-Day and Time info */}
              <div className="flex items-center gap-2">
                {dDayInfo.label && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      dDayInfo.isToday
                        ? 'bg-rose-500 text-white animate-pulse'
                        : dDayInfo.isUpcoming
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {dDayInfo.label}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{schedule.startTime} ~ {schedule.endTime}</span>
                  <span className="text-slate-400">({durationStr})</span>
                </div>
              </div>

            </div>

            {/* Body Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3.5 text-xs text-slate-600">
              
              {/* Location & Leader */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-800">{schedule.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>담당: {schedule.cellLeader} ({schedule.contact})</span>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>참여 인원: <strong className="text-blue-600 font-black">{schedule.participantCount}명</strong></span>
                </div>
                {schedule.participants && schedule.participants.length > 0 && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    명단: {schedule.participants.join(', ')}
                    {schedule.participantCount > schedule.participants.length && (
                      <span className="text-slate-400 font-medium"> 외 {schedule.participantCount - schedule.participants.length}명</span>
                    )}
                  </p>
                )}
              </div>

              {/* Prayer Snippet & Action buttons */}
              <div className="flex items-center justify-between gap-2 md:justify-end">
                {schedule.prayerTopics ? (
                  <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 max-w-[220px] truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{schedule.prayerTopics}</span>
                  </div>
                ) : <div />}

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyShareText(schedule);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                    title="카카오톡 공유 문구 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700 pl-1">
                    <span>상세보기</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
};
