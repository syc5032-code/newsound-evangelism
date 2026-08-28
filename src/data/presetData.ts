import type { EvangelismSchedule } from '../types';

export const ADMIN_PASSWORDS = ['newsound77', '7777', '1234'];

export const CELL_PRESETS = [
  '송예찬셀',
  '권회인셀',
  '윤수민셀',
  '한은택셀',
  '박창현셀'
];

export const CORPS_PRESETS = [
  '김태홍 군단',
  '김은진 군단'
];

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
  if (name.includes('송예찬')) return 'blue';
  if (name.includes('권회인')) return 'emerald';
  if (name.includes('윤수민')) return 'violet';
  if (name.includes('한은택')) return 'amber';
  if (name.includes('박창현')) return 'rose';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colorIndex = Math.abs(hash + index) % COLOR_KEYS.length;
  return COLOR_KEYS[colorIndex];
};

export const INITIAL_SAMPLE_SCHEDULES: EvangelismSchedule[] = [
  // 1. 송예찬셀 (김태홍 군단)
  {
    id: 'sample-1',
    cellName: '송예찬셀',
    corpsName: '김태홍 군단',
    cellLeader: '송예찬',
    contact: '010-3456-7890',
    date: '2026-08-28',
    dayOfWeek: '금요일',
    startTime: '19:00',
    endTime: '20:30',
    durationMinutes: 90,
    location: '마곡역 3번 출구 앞',
    participantCount: 6,
    participants: ['송예찬', '이지훈', '박서연', '최도윤', '정유나', '강민호'],
    prayerTopics: '불금 퇴근길 마곡역을 지나는 많은 직장인들과 청년들의 마음 문이 열려 복음이 전해지게 하시고, 셀원들이 담대하고 기쁨으로 전도하도록 중보해주세요.',
    password: '1234',
    themeColor: 'blue',
    createdAt: '2026-08-20T10:00:00.000Z'
  },
  // 2. 권회인셀 (김은진 군단)
  {
    id: 'sample-2',
    cellName: '권회인셀',
    corpsName: '김은진 군단',
    cellLeader: '권회인',
    contact: '010-8765-4321',
    date: '2026-08-29',
    dayOfWeek: '토요일',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    location: '롯데리아 앞',
    participantCount: 7,
    participants: ['권회인', '송미경', '임재원', '한수빈', '조형석', '김지혜', '박성현'],
    prayerTopics: '주말 오후 롯데리아 앞을 오가는 청소년들과 이웃들에게 예수님의 사랑이 따뜻하고 친절하게 전해지기를 기도합니다.',
    password: '1234',
    themeColor: 'emerald',
    createdAt: '2026-08-21T14:30:00.000Z'
  },
  // 3. 윤수민셀 (김태홍 군단)
  {
    id: 'sample-3',
    cellName: '윤수민셀',
    corpsName: '김태홍 군단',
    cellLeader: '윤수민',
    contact: '010-2345-6789',
    date: '2026-08-30',
    dayOfWeek: '일요일',
    startTime: '15:30',
    endTime: '17:30',
    durationMinutes: 120,
    location: '마곡역 2번 출구 앞',
    participantCount: 5,
    participants: ['윤수민', '오수진', '배성현', '문채원', '차은우'],
    prayerTopics: '주일 예배 후 전도 출격합니다. 만나는 모든 영혼들이 주님의 평안을 얻고 교회로 발걸음이 이어지도록 함께 기도해주세요.',
    password: '1234',
    themeColor: 'violet',
    createdAt: '2026-08-22T09:15:00.000Z'
  },
  // 4. 한은택셀 (김은진 군단)
  {
    id: 'sample-4',
    cellName: '한은택셀',
    corpsName: '김은진 군단',
    cellLeader: '한은택',
    contact: '010-4567-8901',
    date: '2026-09-02',
    dayOfWeek: '수요일',
    startTime: '18:30',
    endTime: '20:00',
    durationMinutes: 90,
    location: '롯데리아 앞 사거리',
    participantCount: 6,
    participants: ['한은택', '이영희', '유태현', '서지원', '노현우', '고은비'],
    prayerTopics: '수요예배 전 퇴근길 전도입니다. 지친 현대인들에게 복음의 참된 위로와 생수가 흘러가게 하소서.',
    password: '1234',
    themeColor: 'amber',
    createdAt: '2026-08-23T11:20:00.000Z'
  },
  // 5. 박창현셀 (김태홍 군단)
  {
    id: 'sample-5',
    cellName: '박창현셀',
    corpsName: '김태홍 군단',
    cellLeader: '박창현',
    contact: '010-5678-1234',
    date: '2026-09-05',
    dayOfWeek: '토요일',
    startTime: '10:30',
    endTime: '12:30',
    durationMinutes: 120,
    location: '마곡역 4번 출구 앞',
    participantCount: 8,
    participants: ['박창현', '정하늘', '이준우', '김하은', '신재민', '권다영', '황성호', '안지민'],
    prayerTopics: '토요일 오전 마곡역 전도 출격합니다. 셀원들이 성령 충만하여 담대하게 복음을 전하고 구원의 열매를 맺게 하소서.',
    password: '1234',
    themeColor: 'rose',
    createdAt: '2026-08-24T16:40:00.000Z'
  },
  // 6. 송예찬셀 (김태홍 군단)
  {
    id: 'sample-6',
    cellName: '송예찬셀',
    corpsName: '김태홍 군단',
    cellLeader: '송예찬',
    contact: '010-3456-7890',
    date: '2026-09-05',
    dayOfWeek: '토요일',
    startTime: '14:00',
    endTime: '16:30',
    durationMinutes: 150,
    location: '롯데리아 앞',
    participantCount: 6,
    participants: ['송예찬', '이지훈', '최도윤', '강민호', '류수정', '장민석'],
    prayerTopics: '거리에서 마주치는 모든 이웃들에게 친절한 미소와 따뜻한 마음으로 다가가겠습니다.',
    password: '1234',
    themeColor: 'blue',
    createdAt: '2026-08-25T13:00:00.000Z'
  },
  // 7. 권회인셀 (김은진 군단)
  {
    id: 'sample-7',
    cellName: '권회인셀',
    corpsName: '김은진 군단',
    cellLeader: '권회인',
    contact: '010-8765-4321',
    date: '2026-09-06',
    dayOfWeek: '일요일',
    startTime: '16:00',
    endTime: '18:00',
    durationMinutes: 120,
    location: '마곡역',
    participantCount: 7,
    participants: ['권회인', '송미경', '임재원', '조형석', '차은우', '우지민', '구본승'],
    prayerTopics: '셀원들이 기쁨으로 하나 되어 전도에 동참하게 하시고, 복음을 들은 모든 분들이 구원의 확신을 갖도록 중보 부탁드립니다.',
    password: '1234',
    themeColor: 'emerald',
    createdAt: '2026-08-26T15:10:00.000Z'
  },
  // 8. 윤수민셀 (김태홍 군단)
  {
    id: 'sample-8',
    cellName: '윤수민셀',
    corpsName: '김태홍 군단',
    cellLeader: '윤수민',
    contact: '010-2345-6789',
    date: '2026-09-12',
    dayOfWeek: '토요일',
    startTime: '13:30',
    endTime: '15:30',
    durationMinutes: 120,
    location: '롯데리아 앞',
    participantCount: 5,
    participants: ['윤수민', '오수진', '배성현', '문채원', '하성운'],
    prayerTopics: '지역 상권 주민들과 청년들에게 축복의 말을 전하며 복음의 씨앗을 심겠습니다.',
    password: '1234',
    themeColor: 'violet',
    createdAt: '2026-08-27T10:00:00.000Z'
  },
  // 9. 한은택셀 (김은진 군단)
  {
    id: 'sample-9',
    cellName: '한은택셀',
    corpsName: '김은진 군단',
    cellLeader: '한은택',
    contact: '010-4567-8901',
    date: '2026-09-19',
    dayOfWeek: '토요일',
    startTime: '14:00',
    endTime: '16:00',
    durationMinutes: 120,
    location: '마곡역 1번 출구 앞',
    participantCount: 6,
    participants: ['한은택', '이영희', '유태현', '서지원', '노현우', '고은비'],
    prayerTopics: '환절기 날씨 속에서 전도대원들의 건강을 지켜주시고 담대하게 복음을 증거하게 하소서.',
    password: '1234',
    themeColor: 'amber',
    createdAt: '2026-08-27T14:20:00.000Z'
  },
  // 10. 박창현셀 (김태홍 군단)
  {
    id: 'sample-10',
    cellName: '박창현셀',
    corpsName: '김태홍 군단',
    cellLeader: '박창현',
    contact: '010-5678-1234',
    date: '2026-09-26',
    dayOfWeek: '토요일',
    startTime: '15:00',
    endTime: '17:00',
    durationMinutes: 120,
    location: '마곡역 및 롯데리아 앞',
    participantCount: 8,
    participants: ['박창현', '정하늘', '이준우', '김하은', '신재민', '권다영', '황성호', '안지민'],
    prayerTopics: '9월의 마지막 주말 전도입니다. 그동안 복음을 전해 들은 분들이 예배의 자리로 나아오도록 기도해주세요.',
    password: '1234',
    themeColor: 'rose',
    createdAt: '2026-08-27T16:00:00.000Z'
  }
];
