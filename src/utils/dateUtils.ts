import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSunday,
  isSaturday,
  parseISO,
  differenceInDays,
  startOfDay
} from 'date-fns';
import { ko } from 'date-fns/locale';
import type { CalendarDay, EvangelismSchedule } from '../types';

export const KOREAN_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
export const KOREAN_DAYS_FULL = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

export const getDayOfWeekKorean = (dateInput: Date | string): string => {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(d, 'EEEE', { locale: ko });
};

export const getDayOfWeekShort = (dateInput: Date | string): string => {
  const d = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
  return format(d, 'E', { locale: ko });
};

export const formatDateFullKorean = (dateStr: string): string => {
  try {
    const d = parseISO(dateStr);
    return `${format(d, 'yyyy년 M월 d일')} (${getDayOfWeekKorean(d)})`;
  } catch {
    return dateStr;
  }
};

export const formatTimeDisplay = (startTime: string, endTime: string): string => {
  return `${startTime} ~ ${endTime}`;
};

export const calculateDurationMinutes = (startTime: string, endTime: string): number => {
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  const totalStart = startH * 60 + startM;
  const totalEnd = endH * 60 + endM;
  return Math.max(0, totalEnd - totalStart);
};

export const formatDurationString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0 && mins > 0) return `${hours}시간 ${mins}분`;
  if (hours > 0) return `${hours}시간`;
  return `${mins}분`;
};

export const getDDayString = (dateStr: string): { label: string; isUpcoming: boolean; isToday: boolean } => {
  try {
    const targetDate = startOfDay(parseISO(dateStr));
    const today = startOfDay(new Date());
    const diff = differenceInDays(targetDate, today);

    if (diff === 0) {
      return { label: '오늘 전도', isUpcoming: true, isToday: true };
    } else if (diff === 1) {
      return { label: '내일 (D-1)', isUpcoming: true, isToday: false };
    } else if (diff > 1 && diff <= 7) {
      return { label: `D-${diff}`, isUpcoming: true, isToday: false };
    } else if (diff > 7) {
      return { label: `D-${diff}`, isUpcoming: true, isToday: false };
    } else {
      return { label: '완료', isUpcoming: false, isToday: false };
    }
  } catch {
    return { label: '', isUpcoming: false, isToday: false };
  }
};

export const generateMonthGrid = (
  year: number,
  month: number,
  events: EvangelismSchedule[]
): CalendarDay[] => {
  const currentMonthDate = new Date(year, month, 1);
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const daysInterval = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventsByDate = new Map<string, EvangelismSchedule[]>();
  events.forEach((event) => {
    const existing = eventsByDate.get(event.date) || [];
    eventsByDate.set(event.date, [...existing, event]);
  });

  return daysInterval.map((d) => {
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayEvents = (eventsByDate.get(dateStr) || []).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return {
      date: d,
      dateString: dateStr,
      dayNumber: d.getDate(),
      isCurrentMonth: isSameMonth(d, currentMonthDate),
      isToday: isToday(d),
      isSunday: isSunday(d),
      isSaturday: isSaturday(d),
      events: dayEvents
    };
  });
};
