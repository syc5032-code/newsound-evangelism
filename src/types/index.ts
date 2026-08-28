export interface EvangelismSchedule {
  id: string;
  cellName: string; // 소속군단 명칭 (예: 김태홍, 김은진)
  cellLeader: string; // 신청자/리더 이름
  contact: string;
  date: string; // YYYY-MM-DD
  dayOfWeek?: string; // e.g. "토요일"
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  durationMinutes: number; // 120
  location: string; // 전도 장소 (예: 마곡역, 롯데리아 앞)
  participantCount: number;
  participants: string[];
  supplies?: string[];
  prayerTopics: string;
  password?: string; // 수정/삭제용 4자리 비밀번호
  themeColor: string; // Tailwind color theme identifier
  createdAt: string;
  updatedAt?: string;
}

export type ViewMode = 'month' | 'week' | 'list';

export interface CalendarDay {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  isSaturday: boolean;
  events: EvangelismSchedule[];
}

export interface FilterOptions {
  searchQuery: string;
  selectedCell: string;
  selectedLocation: string;
  selectedMonth: string; // YYYY-MM
}

export interface OverviewStats {
  totalEvents: number;
  totalParticipants: number;
  totalHours: number;
  activeCellsCount: number;
  topLocation: string;
  upcomingEvent: EvangelismSchedule | null;
}
