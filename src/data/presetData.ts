import type { EvangelismSchedule } from '../types';

export const CORPS_PRESETS = [
  '김태홍',
  '김은진'
];

export const CELL_PRESETS = CORPS_PRESETS;

export const LOCATION_PRESETS = [
  '마곡역',
  '롯데리아 앞'
];

export const CELL_COLORS: { [key: string]: { bg: string; text: string; border: string; badge: string; ring: string } } = {
  blue: {
    bg: 'bg-blue-50 hover:bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-600 text-white',
    ring: 'ring-blue-500'
  },
  emerald: {
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    badge: 'bg-emerald-600 text-white',
    ring: 'ring-emerald-500'
  },
  violet: {
    bg: 'bg-violet-50 hover:bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
    badge: 'bg-violet-600 text-white',
    ring: 'ring-violet-500'
  },
  amber: {
    bg: 'bg-amber-50 hover:bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    badge: 'bg-amber-600 text-white',
    ring: 'ring-amber-500'
  },
  rose: {
    bg: 'bg-rose-50 hover:bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
    badge: 'bg-rose-600 text-white',
    ring: 'ring-rose-500'
  },
  cyan: {
    bg: 'bg-cyan-50 hover:bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    badge: 'bg-cyan-600 text-white',
    ring: 'ring-cyan-500'
  },
  indigo: {
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    badge: 'bg-indigo-600 text-white',
    ring: 'ring-indigo-500'
  },
  orange: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    badge: 'bg-orange-600 text-white',
    ring: 'ring-orange-500'
  }
};

export const COLOR_KEYS = Object.keys(CELL_COLORS);

export const getCellColor = (name: string, index = 0): string => {
  if (name.includes('태홍')) return 'blue';
  if (name.includes('은진')) return 'emerald';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash + index) % COLOR_KEYS.length;
  return COLOR_KEYS[colorIndex];
};

export const INITIAL_SAMPLE_SCHEDULES: EvangelismSchedule[] = [
  {
    id: 'sample-1',
    cellName: '김태홍',
    cellLeader: '김태홍',
    contact: '010-3456-7890',
    date: '2026-08-29',
    dayOfWeek: '토요일',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    location: '마곡역',
    participantCount: 6,
    participants: ['김태홍', '이지훈', '박서연', '최도윤', '정유나', '강민호'],
    prayerTopics: '마곡역을 오가는 청년들과 직장인들에게 복음의 기쁜 소식이 온전히 전해지도록 기도 부탁드립니다.',
    themeColor: 'blue',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'sample-2',
    cellName: '김은진',
    cellLeader: '김은진',
    contact: '010-8765-4321',
    date: '2026-08-30',
    dayOfWeek: '일요일',
    startTime: '15:30',
    endTime: '17:00',
    durationMinutes: 90,
    location: '롯데리아 앞',
    participantCount: 5,
    participants: ['김은진', '송미경', '임재원', '한수빈', '조형석'],
    prayerTopics: '롯데리아 앞을 지나는 이웃들과 청소년들에게 하나님의 사랑이 따뜻하게 닿기를 소망합니다.',
    themeColor: 'emerald',
    createdAt: '2026-08-21T14:30:00.000Z'
  },
  {
    id: 'sample-3',
    cellName: '김태홍',
    cellLeader: '김태홍',
    contact: '010-3456-7890',
    date: '2026-09-05',
    dayOfWeek: '토요일',
    startTime: '10:30',
    endTime: '12:30',
    durationMinutes: 120,
    location: '마곡역',
    participantCount: 7,
    participants: ['김태홍', '박서연', '이준우', '신재민', '권다영', '황성호', '안지민'],
    prayerTopics: '주말 오전 마곡역 전도 가운데 은혜와 기쁨이 넘치게 하시고, 새신자들의 발걸음이 교회로 이어지길 기도합니다.',
    themeColor: 'blue',
    createdAt: '2026-08-23T11:20:00.000Z'
  },
  {
    id: 'sample-4',
    cellName: '김은진',
    cellLeader: '김은진',
    contact: '010-8765-4321',
    date: '2026-09-06',
    dayOfWeek: '일요일',
    startTime: '16:00',
    endTime: '17:30',
    durationMinutes: 90,
    location: '롯데리아 앞',
    participantCount: 6,
    participants: ['김은진', '이영희', '유태현', '서지원', '노현우', '고은비'],
    prayerTopics: '셀원들이 하나 되어 담대하고 온유한 마음으로 복음을 선포하도록 함께 중보해주세요.',
    themeColor: 'emerald',
    createdAt: '2026-08-24T16:40:00.000Z'
  },
  {
    id: 'sample-5',
    cellName: '김태홍',
    cellLeader: '김태홍',
    contact: '010-3456-7890',
    date: '2026-09-12',
    dayOfWeek: '토요일',
    startTime: '14:00',
    endTime: '16:30',
    durationMinutes: 150,
    location: '마곡역',
    participantCount: 8,
    participants: ['김태홍', '이지훈', '최도윤', '강민호', '오수진', '배성현', '문채원', '하성운'],
    prayerTopics: '만나는 모든 이웃들의 마음 문이 열리고 주님의 평안이 임하는 귀한 전도 시간 되길 원합니다.',
    themeColor: 'blue',
    createdAt: '2026-08-26T15:10:00.000Z'
  },
  {
    id: 'sample-6',
    cellName: '김은진',
    cellLeader: '김은진',
    contact: '010-8765-4321',
    date: '2026-09-19',
    dayOfWeek: '토요일',
    startTime: '13:30',
    endTime: '15:30',
    durationMinutes: 120,
    location: '롯데리아 앞',
    participantCount: 5,
    participants: ['김은진', '송미경', '임재원', '조형석', '차은우'],
    prayerTopics: '전도에 동참하는 모든 셀원들의 영육을 강건케 하시고 기쁨의 열매를 맺게 하소서.',
    themeColor: 'emerald',
    createdAt: '2026-08-27T10:00:00.000Z'
  }
];
