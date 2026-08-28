import React from 'react';
import { Clock, MapPin, Phone, Users, MessageSquare, Copy, ChevronRight } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
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
      <div className="bg-[#ffffff] rounded-[36px] p-12 text-center border border-[#ececee]">
        <div className="w-12 h-12 mx-auto mb-3.5 rounded-[16px] bg-[#f4f4f5] text-[#18181b] flex items-center justify-center border border-[#ececee]">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-[#09090b] mb-1">
          신청된 노방전도 일정이 없습니다
        </h3>
        <p className="text-xs text-[#71717a] max-w-sm mx-auto">
          상단의 '노방전도 신청하기' 버튼을 눌러 소속 셀의 새로운 일정을 등록해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {sortedSchedules.map((schedule) => {
        const dDayInfo = getDDayString(schedule.date);
        const durationStr = formatDurationString(schedule.durationMinutes);

        return (
          <div
            key={schedule.id}
            onClick={() => onSelectSchedule(schedule)}
            className="group bg-[#ffffff] rounded-[28px] p-5 border border-[#ececee] hover:border-[#09090b] transition-all cursor-pointer"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#ececee]">
              
              {/* Cell & Corps Header */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-[12px] text-xs font-semibold bg-[#18181b] text-[#ffffff]">
                  {schedule.cellName} {schedule.corpsName ? `(${schedule.corpsName})` : ''}
                </span>
                <span className="text-sm sm:text-base font-semibold text-[#09090b]">
                  {formatDateFullKorean(schedule.date)}
                </span>
              </div>

              {/* D-Day and Time info */}
              <div className="flex items-center gap-2">
                {dDayInfo.label && (
                  <span
                    className={`px-2.5 py-0.5 rounded-[12px] text-xs font-semibold ${
                      dDayInfo.isToday
                        ? 'bg-[#ff5a00] text-[#ffffff]'
                        : dDayInfo.isUpcoming
                        ? 'bg-[#f4f4f5] text-[#18181b] border border-[#ececee]'
                        : 'bg-[#f4f4f5] text-[#a1a1aa]'
                    }`}
                  >
                    {dDayInfo.label}
                  </span>
                )}
                <div className="flex items-center gap-1.5 text-xs text-[#52525b] bg-[#f4f4f5] px-2.5 py-1 rounded-[12px] border border-[#ececee]">
                  <Clock className="w-3.5 h-3.5 text-[#71717a]" />
                  <span>{schedule.startTime} ~ {schedule.endTime}</span>
                  <span className="text-[#a1a1aa]">({durationStr})</span>
                </div>
              </div>

            </div>

            {/* Body Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-[#52525b]">
              
              {/* Location & Leader */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#71717a] shrink-0" />
                  <span className="font-semibold text-[#09090b]">{schedule.location}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#71717a]">
                  <Phone className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" />
                  <span>신청자: {schedule.cellLeader} ({schedule.contact})</span>
                </div>
              </div>

              {/* Participants */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[#18181b]">
                  <Users className="w-4 h-4 text-[#71717a] shrink-0" />
                  <span>참여 인원: <strong className="text-[#09090b] font-semibold">{schedule.participantCount}명</strong></span>
                </div>
                {schedule.participants && schedule.participants.length > 0 && (
                  <p className="text-[11px] text-[#71717a] line-clamp-1">
                    명단: {schedule.participants.join(', ')}
                    {schedule.participantCount > schedule.participants.length && (
                      <span> 외 {schedule.participantCount - schedule.participants.length}명</span>
                    )}
                  </p>
                )}
              </div>

              {/* Prayer Snippet & Action buttons */}
              <div className="flex items-center justify-between gap-2 md:justify-end">
                {schedule.prayerTopics ? (
                  <div className="hidden lg:flex items-center gap-1 text-[11px] text-[#71717a] max-w-[200px] truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#a1a1aa] shrink-0" />
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
                    className="p-2 text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] rounded-[12px] border border-[#ececee] transition-colors cursor-pointer"
                    title="카카오톡 공유 문구 복사"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1 text-xs font-medium text-[#09090b] group-hover:text-[#ff5a00] pl-1 transition-colors">
                    <span>상세보기</span>
                    <ChevronRight className="w-4 h-4" />
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
