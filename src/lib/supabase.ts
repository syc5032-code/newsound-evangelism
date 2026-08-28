import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { EvangelismSchedule } from '../types';

const SUPABASE_URL_KEY = 'NEWSOUND_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'NEWSOUND_SUPABASE_ANON_KEY';

export const getSupabaseConfig = () => {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

  const storedUrl = localStorage.getItem(SUPABASE_URL_KEY) || '';
  const storedKey = localStorage.getItem(SUPABASE_ANON_KEY) || '';

  const url = envUrl || storedUrl;
  const anonKey = envKey || storedKey;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('https://'))
  };
};

export const setSupabaseCustomConfig = (url: string, anonKey: string) => {
  if (url && anonKey) {
    localStorage.setItem(SUPABASE_URL_KEY, url.trim());
    localStorage.setItem(SUPABASE_ANON_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_ANON_KEY);
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(config.url, config.anonKey);
  }
  return supabaseInstance;
};

// Map DB Row to EvangelismSchedule
export const mapRowToSchedule = (row: any): EvangelismSchedule => {
  return {
    id: String(row.id),
    cellName: row.cell_name || '',
    corpsName: row.corps_name || '',
    cellLeader: row.cell_leader || '',
    contact: row.contact || '',
    date: row.date,
    dayOfWeek: row.day_of_week || '',
    startTime: row.start_time || '14:00',
    endTime: row.end_time || '16:00',
    durationMinutes: Number(row.duration_minutes) || 0,
    location: row.location || '',
    participantCount: Number(row.participant_count) || 0,
    participants: Array.isArray(row.participants) ? row.participants : [],
    prayerTopics: row.prayer_topics || '',
    password: row.password || '',
    themeColor: row.theme_color || 'blue',
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at
  };
};

// Map EvangelismSchedule to DB Row
export const mapScheduleToRow = (s: EvangelismSchedule) => {
  return {
    id: s.id,
    cell_name: s.cellName,
    corps_name: s.corpsName,
    cell_leader: s.cellLeader,
    contact: s.contact,
    date: s.date,
    day_of_week: s.dayOfWeek || '',
    start_time: s.startTime,
    end_time: s.endTime,
    duration_minutes: s.durationMinutes,
    location: s.location,
    participant_count: s.participantCount,
    participants: s.participants || [],
    prayer_topics: s.prayerTopics || '',
    password: s.password || '',
    theme_color: s.themeColor || 'blue',
    updated_at: new Date().toISOString()
  };
};
