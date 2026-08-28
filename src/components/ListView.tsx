import React from 'react';
import { Clock, MapPin, Phone, Users, MessageSquare, Copy, ChevronRight } from 'lucide-react';
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
  // Sort schedules by date and startTime
  const sortedSchedules = [...schedules].sort((a, b) => {
    const dateComp = a.date.localeCompare(b.date);
    if (dateComp !== 0) return dateComp;
    return a.startTime.localeCompare(b.startTime);
  });

  if (sortedSchedules.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
        <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
          <Clock className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800 mb-1">
          신청된 노방전도 일정이 없습니다
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          상단의 '노방전도 신청' 버튼을 눌러 소속 셀의 새로운 전도 일정을 등록해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {sortedSchedules.map((schedule) => {
        const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
        const dDayInfo = getDDayString(schedule.date);
        const durationStr = formatDurationString(schedule.durationMinutes);

        return (
          <div
            key={schedule.id}
            onClick={() => onSelectSchedule(schedule)}
            className="group relative bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border border-slate-200/80 hover:border-blue-300/80 shadow-xs hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden"
          >
            {/* Subtle left colored accent stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${colorTheme.badge}`} />

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100 pl-1">
              
              {/* Cell & Corps Header */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-xl text-xs font-bold shadow-2xs ${colorTheme.badge}`}>
                  {schedule.cellName} {schedule.corpsName ? `(${schedule.corpsName})` : ''}
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900">
                  {formatDateFullKorean(schedule.date)}
                </span>
              </div>

              {/* D-Day and Time info */}
              <div className="flex items-center gap-2">
                {dDayInfo.label && (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs ${
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
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{schedule.startTime} ~ {schedule.endTime}</span>
                  <span className="text-slate-400">({durationStr})</span>
                </div>
              </div>

            </div>

            {/* Body Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3.5 text-xs text-slate-600 pl-1">
              
              {/* Location & Leader */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="font-bold text-slate-800">{schedule.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>신청자: <strong className="text-slate-700">{schedule.cellLeader}</strong> ({schedule.contact})</span>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>참여 인원: <strong className="text-blue-600 font-black">{schedule.participantCount}명</strong></span>
                </div>
                {schedule.participants && schedule.participants.length > 0 && (
                  <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">
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
                  <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-500 max-w-[220px] truncate italic bg-slate-50/80 px-2.5 py-1 rounded-xl border border-slate-200/50">
                    <MessageSquare className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                    <span className="truncate">"{schedule.prayerTopics}"</span>
                  </div>
                ) : <div />}

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopyShareText(schedule);
                    }}
                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200/80 transition-colors shadow-2xs cursor-pointer"
                    title="카카오톡 공유 문구 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-700 pl-1">
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
