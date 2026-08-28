import React, { useState } from 'react';
import { X, Clock, MapPin, Phone, Users, MessageSquare, Copy, Edit, Trash2, MessageCircle, UserPlus } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { CELL_COLORS } from '../data/presetData';
import { formatDateFullKorean, formatDurationString, getDDayString } from '../utils/dateUtils';

interface DetailModalProps {
  schedule: EvangelismSchedule | null;
  onClose: () => void;
  onEdit: (schedule: EvangelismSchedule) => void;
  onDelete: (id: string) => void;
  onCopyShareText: (schedule: EvangelismSchedule) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  schedule,
  onClose,
  onEdit,
  onDelete,
  onCopyShareText,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!schedule) return null;

  const colorTheme = CELL_COLORS[schedule.themeColor] || CELL_COLORS.blue;
  const dDayInfo = getDDayString(schedule.date);
  const durationStr = formatDurationString(schedule.durationMinutes);

  const participantNamesCount = schedule.participants ? schedule.participants.length : 0;
  const unassignedCount = Math.max(0, schedule.participantCount - participantNamesCount);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header Banner */}
        <div className={`p-5 sm:p-6 border-b ${colorTheme.border} ${colorTheme.bg} flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-3 py-1 rounded-xl text-xs font-bold ${colorTheme.badge}`}>
                {schedule.cellName} 군단
              </span>
              {dDayInfo.label && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    dDayInfo.isToday
                      ? 'bg-rose-500 text-white animate-pulse'
                      : dDayInfo.isUpcoming
                      ? 'bg-white/80 text-blue-700 border border-blue-200'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {dDayInfo.label}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {formatDateFullKorean(schedule.date)}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              신청일시: {new Date(schedule.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-black/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Key Info Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Time & Duration */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>전도 시간</span>
              </span>
              <p className="text-sm font-bold text-slate-900">
                {schedule.startTime} ~ {schedule.endTime}
              </p>
              <p className="text-xs text-blue-600 font-semibold">
                총 {durationStr} 진행
              </p>
            </div>

            {/* Location */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>전도 장소</span>
              </span>
              <p className="text-sm font-bold text-slate-900 break-words">
                {schedule.location}
              </p>
              <a
                href={`https://map.kakao.com/?q=${encodeURIComponent(schedule.location)}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:underline inline-block font-medium"
              >
                지도에서 위치 확인 ↗
              </a>
            </div>

          </div>

          {/* Leader & Contact Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold text-slate-400">신청자 / 담당 리더</span>
              <p className="text-sm font-bold text-slate-800">
                {schedule.cellLeader}
              </p>
              <p className="text-xs text-slate-500 font-mono">
                {schedule.contact}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${schedule.contact}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>전화하기</span>
              </a>
              <a
                href={`sms:${schedule.contact}`}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>문자</span>
              </a>
            </div>
          </div>

          {/* Participants Section: 참석 셀원 명단 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>참석 셀원 명단</span>
              </h3>
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                총 {schedule.participantCount}명
              </span>
            </div>

            {participantNamesCount > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                {schedule.participants.map((name, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-xs"
                  >
                    👤 {name}
                  </span>
                ))}
                {unassignedCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-200/70 border border-dashed border-slate-300 text-slate-600">
                    <UserPlus className="w-3 h-3 text-slate-400" />
                    <span>외 {unassignedCount}명 참석 예정</span>
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>세부 참석자 명단 미기재</span>
                <span className="font-semibold text-blue-600">총 {schedule.participantCount}명 출격 확정</span>
              </div>
            )}
          </div>

          {/* Prayer Topics Section: 셀원 기도제목 & 나눔 */}
          {schedule.prayerTopics && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-violet-500" />
                <span>셀원 기도제목 & 나눔</span>
              </h3>
              <div className="p-4 rounded-2xl bg-violet-50/50 border border-violet-100 text-xs sm:text-sm text-slate-700 leading-relaxed italic whitespace-pre-line">
                "{schedule.prayerTopics}"
              </div>
            </div>
          )}

          {/* Delete Confirmation Alert */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 animate-in fade-in">
              <p className="text-xs font-bold text-rose-800">
                정말로 이 노방전도 일정을 삭제하시겠습니까?
              </p>
              <p className="text-[11px] text-rose-600">
                삭제 후에는 복구할 수 없습니다.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onDelete(schedule.id)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  네, 삭제합니다
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50 cursor-pointer"
                >
                  취소
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Sticky Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex flex-wrap items-center justify-between gap-2.5">
          
          {/* Left: Delete button */}
          <div className="flex items-center gap-2">
            {!showDeleteConfirm && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="일정 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>삭제</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onEdit(schedule);
                onClose();
              }}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="일정 수정"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>수정</span>
            </button>
          </div>

          {/* Right: Kakao Share & Close */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onCopyShareText(schedule)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-800 bg-[#FEE500] hover:bg-[#FADA0A] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              title="카카오톡/문자 공유 텍스트 복사"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>카톡 공유 문구 복사</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              닫기
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
