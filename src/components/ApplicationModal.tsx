import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Lock } from 'lucide-react';
import type { EvangelismSchedule } from '../types';
import { CORPS_PRESETS, LOCATION_PRESETS, CELL_COLORS, COLOR_KEYS, getCellColor } from '../data/presetData';
import { getDayOfWeekKorean, calculateDurationMinutes, formatDurationString } from '../utils/dateUtils';
import confetti from 'canvas-confetti';
import { format } from 'date-fns';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: EvangelismSchedule) => void;
  initialDate?: string;
  editSchedule?: EvangelismSchedule | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  editSchedule,
}) => {
  const isEditing = !!editSchedule;

  // Form states
  const [cellName, setCellName] = useState('');
  const [corpsName, setCorpsName] = useState('김태홍 군단');
  const [cellLeader, setCellLeader] = useState('');
  const [contact, setContact] = useState('');
  const [date, setDate] = useState(initialDate || format(new Date(), 'yyyy-MM-dd'));
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('16:00');
  const [location, setLocation] = useState('');
  const [participantCount, setParticipantCount] = useState(5);
  const [participants, setParticipants] = useState<string[]>([]);
  const [participantInput, setParticipantInput] = useState('');
  const [prayerTopics, setPrayerTopics] = useState('');
  const [password, setPassword] = useState('1234');
  const [themeColor, setThemeColor] = useState('blue');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editSchedule) {
      setCellName(editSchedule.cellName || '');
      setCorpsName(editSchedule.corpsName || '김태홍 군단');
      setCellLeader(editSchedule.cellLeader || '');
      setContact(editSchedule.contact || '');
      setDate(editSchedule.date || format(new Date(), 'yyyy-MM-dd'));
      setStartTime(editSchedule.startTime || '14:00');
      setEndTime(editSchedule.endTime || '16:00');
      setLocation(editSchedule.location || '');
      setParticipantCount(editSchedule.participantCount || 1);
      setParticipants(editSchedule.participants || []);
      setPrayerTopics(editSchedule.prayerTopics || '');
      setPassword(editSchedule.password || '1234');
      setThemeColor(editSchedule.themeColor || 'blue');
    } else {
      // New application
      const defaultDate = initialDate || format(new Date(), 'yyyy-MM-dd');
      setDate(defaultDate);
      setCellName('');
      setCorpsName('김태홍 군단');
      setCellLeader('');
      setContact('');
      setStartTime('14:00');
      setEndTime('16:00');
      setLocation('');
      setParticipantCount(5);
      setParticipants([]);
      setPrayerTopics('');
      setPassword('1234');
      setThemeColor('blue');
    }
    setErrorMsg('');
  }, [editSchedule, initialDate, isOpen]);

  if (!isOpen) return null;

  // Calculate day of week
  let dayOfWeekKorean = '';
  try {
    if (date) {
      dayOfWeekKorean = getDayOfWeekKorean(date);
    }
  } catch {
    dayOfWeekKorean = '';
  }

  // Calculate duration
  const durationMinutes = calculateDurationMinutes(startTime, endTime);

  // Quick duration setter
  const handleQuickDuration = (minutes: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const startTotal = h * 60 + m;
    const endTotal = (startTotal + minutes) % (24 * 60);
    const endH = Math.floor(endTotal / 60).toString().padStart(2, '0');
    const endM = (endTotal % 60).toString().padStart(2, '0');
    setEndTime(`${endH}:${endM}`);
  };

  // Participant tag add/remove
  const handleAddParticipant = () => {
    const trimmed = participantInput.trim();
    if (!trimmed) return;
    if (!participants.includes(trimmed)) {
      const nextParticipants = [...participants, trimmed];
      setParticipants(nextParticipants);
      if (nextParticipants.length > participantCount) {
        setParticipantCount(nextParticipants.length);
      }
    }
    setParticipantInput('');
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
  };


  // Form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cellName.trim()) {
      setErrorMsg('신청셀 명칭을 입력하거나 선택해주세요. (예: 송예찬셀)');
      return;
    }
    if (!corpsName.trim()) {
      setErrorMsg('소속 군단을 선택하거나 입력해주세요. (예: 김태홍 군단)');
      return;
    }
    if (!cellLeader.trim()) {
      setErrorMsg('신청자(리더) 이름을 입력해주세요.');
      return;
    }
    if (!contact.trim()) {
      setErrorMsg('신청자 연락처를 입력해주세요.');
      return;
    }
    if (!date) {
      setErrorMsg('전도 일자를 선택해주세요.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('전도 장소를 입력하거나 선택해주세요.');
      return;
    }
    if (participantCount < 1) {
      setErrorMsg('참여 인원은 최소 1명 이상이어야 합니다.');
      return;
    }

    const newSchedule: EvangelismSchedule = {
      id: editSchedule?.id || `schedule-${Date.now()}`,
      cellName: cellName.trim(),
      corpsName: corpsName.trim(),
      cellLeader: cellLeader.trim(),
      contact: contact.trim(),
      date,
      dayOfWeek: dayOfWeekKorean,
      startTime,
      endTime,
      durationMinutes: durationMinutes > 0 ? durationMinutes : 60,
      location: location.trim(),
      participantCount: Math.max(participantCount, participants.length),
      participants,
      prayerTopics: prayerTopics.trim(),
      password: password.trim() || '1234',
      themeColor: themeColor || getCellColor(cellName),
      createdAt: editSchedule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Confetti effect!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    onSave(newSchedule);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {isEditing ? '노방전도 일정 수정' : '새 노방전도 신청하기'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing ? '신청된 세부 정보를 수정합니다.' : '각 셀의 노방전도 출격 일정을 등록해주세요.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* 1. 신청셀 & 소속 군단 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 신청셀 (수기 직접 입력) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                신청셀 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cellName}
                onChange={(e) => {
                  setCellName(e.target.value);
                  setThemeColor(getCellColor(e.target.value));
                }}
                placeholder="신청셀 이름을 입력해주세요 (예: 송예찬셀)"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

            {/* 소속 군단 */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                소속 군단 <span className="text-rose-500">*</span>
              </label>

              {/* Preset 군단 chips */}
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {CORPS_PRESETS.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setCorpsName(preset)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-bold transition-all cursor-pointer ${
                      corpsName === preset
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={corpsName}
                onChange={(e) => setCorpsName(e.target.value)}
                placeholder="예: 김태홍 군단, 김은진 군단"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>

          </div>

          {/* 2. 신청자 및 연락처 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                신청자 / 담당 리더 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={cellLeader}
                onChange={(e) => setCellLeader(e.target.value)}
                placeholder="예: 송예찬"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                신청자 연락처 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="예: 010-1234-5678"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* 3. 전도 일자 & 요일 */}
          <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>전도 일자 & 시간</span> <span className="text-rose-500">*</span>
              </label>
              {dayOfWeekKorean && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {dayOfWeekKorean}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="block text-[11px] font-semibold text-slate-500 mb-1">날짜</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-500 mb-1">시작 시간</span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <span className="block text-[11px] font-semibold text-slate-500 mb-1">종료 시간</span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Quick Duration Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-500 mr-1">빠른 시간 선택:</span>
              {[
                { label: '1시간', mins: 60 },
                { label: '1시간 30분', mins: 90 },
                { label: '2시간', mins: 120 },
                { label: '2시간 30분', mins: 150 },
                { label: '3시간', mins: 180 },
              ].map((btn) => (
                <button
                  type="button"
                  key={btn.mins}
                  onClick={() => handleQuickDuration(btn.mins)}
                  className="px-2 py-0.5 text-[11px] rounded-md bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 transition-colors cursor-pointer"
                >
                  +{btn.label}
                </button>
              ))}
              {durationMinutes > 0 && (
                <span className="ml-auto text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  총 {formatDurationString(durationMinutes)}
                </span>
              )}
            </div>
          </div>

          {/* 4. 전도 장소 / 구역 */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-slate-700">
              전도 장소 / 구역 <span className="text-rose-500">*</span>
            </label>

            {/* Preset location chips: 마곡역, 롯데리아 앞 */}
            <div className="flex flex-wrap gap-2 mb-1.5">
              {LOCATION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setLocation(preset)}
                  className={`px-3 py-1.5 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                    location === preset
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 롯데리아 앞"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          {/* 5. 참여 인원 수 및 참석 셀원 명단 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                참여 인원 수 & 참석 셀원 명단 <span className="text-rose-500">*</span>
              </label>
              
              {/* Stepper */}
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">인원수:</span>
                <button
                  type="button"
                  onClick={() => setParticipantCount(Math.max(1, participantCount - 1))}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-black text-blue-600 min-w-[20px] text-center">
                  {participantCount}
                </span>
                <button
                  type="button"
                  onClick={() => setParticipantCount(participantCount + 1)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center hover:bg-slate-100 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Participant Name Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddParticipant();
                  }
                }}
                placeholder="참석 셀원 이름 입력 후 [추가] 또는 Enter"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddParticipant}
                className="px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl transition-colors cursor-pointer"
              >
                추가
              </button>
            </div>

            {/* Added Participant tags */}
            {participants.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                {participants.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-xs"
                  >
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(name)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 6. 셀원 기도제목 & 나눔 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              셀원 기도제목 & 나눔
            </label>
            <textarea
              rows={3}
              value={prayerTopics}
              onChange={(e) => setPrayerTopics(e.target.value)}
              placeholder="예: 마곡역을 오가는 청년들의 마음 문이 열리고, 셀원들이 담대하고 기쁨으로 복음을 전하도록 중보해주세요."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* 7. 수정/삭제용 비밀번호 설정 */}
          <div className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>신청 비밀번호 (수정/삭제용)</span> <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              maxLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 4자리 입력 (예: 1234)"
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              required
            />
            <p className="text-[11px] text-slate-400">
              * 등록 후 본인이 직접 일정을 수정하거나 취소할 때 사용됩니다.
            </p>
          </div>

          {/* 8. 컬러 테마 선택 */}
          <div className="space-y-1.5">
            <span className="block text-xs font-bold text-slate-700">캘린더 배지 색상</span>
            <div className="flex items-center gap-2">
              {COLOR_KEYS.map((col) => (
                <button
                  type="button"
                  key={col}
                  onClick={() => setThemeColor(col)}
                  className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                    CELL_COLORS[col].badge
                  } ${
                    themeColor === col
                      ? 'ring-4 ring-offset-2 ring-slate-800 scale-110'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  title={col}
                />
              ))}
            </div>
          </div>

        </form>

        {/* Modal Sticky Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {isEditing ? '수정 완료하기' : '노방전도 신청 완료'}
          </button>
        </div>

      </div>
    </div>
  );
};
