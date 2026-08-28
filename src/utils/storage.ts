import type { EvangelismSchedule } from '../types';
import { INITIAL_SAMPLE_SCHEDULES } from '../data/presetData';
import { formatDateFullKorean, formatDurationString } from './dateUtils';

const STORAGE_KEY = 'CHURCH_EVANGELISM_CORPS_V5';

export const loadSchedules = (): EvangelismSchedule[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SCHEDULES));
      return INITIAL_SAMPLE_SCHEDULES;
    }
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_SCHEDULES;
  } catch (error) {
    console.error('Failed to load evangelism schedules from localStorage:', error);
    return INITIAL_SAMPLE_SCHEDULES;
  }
};

export const saveSchedules = (schedules: EvangelismSchedule[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  } catch (error) {
    console.error('Failed to save evangelism schedules to localStorage:', error);
  }
};

export const resetToSampleData = (): EvangelismSchedule[] => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_SCHEDULES));
  return INITIAL_SAMPLE_SCHEDULES;
};

export const generateKakaoShareText = (schedule: EvangelismSchedule): string => {
  const durationStr = formatDurationString(schedule.durationMinutes);
  
  let participantsList = `\n👥 참여 인원: ${schedule.participantCount}명`;
  if (schedule.participants && schedule.participants.length > 0) {
    if (schedule.participants.length < schedule.participantCount) {
      const remaining = schedule.participantCount - schedule.participants.length;
      participantsList = `\n👥 참여자: ${schedule.participants.join(', ')} 외 ${remaining}명 (총 ${schedule.participantCount}명)`;
    } else {
      participantsList = `\n👥 참여자: ${schedule.participants.join(', ')} (총 ${schedule.participantCount}명)`;
    }
  }

  const prayerText = schedule.prayerTopics
    ? `\n🙏 중보 기도제목: ${schedule.prayerTopics}`
    : '';

  const corpsInfo = schedule.corpsName ? ` (${schedule.corpsName})` : '';

  return `[⛪ 노방전도 일정 안내]
✨ 신청셀: ${schedule.cellName}${corpsInfo}
👤 신청자: ${schedule.cellLeader} (${schedule.contact})
📅 일시: ${formatDateFullKorean(schedule.date)}
⏰ 시간: ${schedule.startTime} ~ ${schedule.endTime} (${durationStr})
📍 전도 장소: ${schedule.location}${participantsList}${prayerText}

"오직 성령이 너희에게 임하시면 너희가 권능을 받고 내 증인이 되리라 (행 1:8)"
많은 중보와 응원 부탁드립니다! ❤️`;
};

export const exportToCSV = (schedules: EvangelismSchedule[]): void => {
  const headers = ['신청셀', '소속군단', '신청자', '연락처', '전도날짜', '요일', '시작시간', '종료시간', '소요시간(분)', '전도장소', '참여인원수', '참여자명단', '기도제목'];
  
  const rows = schedules.map(s => [
    `"${s.cellName.replace(/"/g, '""')}"`,
    `"${(s.corpsName || '').replace(/"/g, '""')}"`,
    `"${s.cellLeader.replace(/"/g, '""')}"`,
    `"${s.contact.replace(/"/g, '""')}"`,
    `"${s.date}"`,
    `"${s.dayOfWeek || ''}"`,
    `"${s.startTime}"`,
    `"${s.endTime}"`,
    s.durationMinutes,
    `"${s.location.replace(/"/g, '""')}"`,
    s.participantCount,
    `"${(s.participants || []).join(', ').replace(/"/g, '""')}"`,
    `"${(s.prayerTopics || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `뉴사운드교회_셀_노방전도_신청현황_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (schedules: EvangelismSchedule[]): void => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schedules, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `노방전도_데이터_백업_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};
