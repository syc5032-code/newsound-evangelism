import type { EvangelismSchedule } from '../types';
import { getSupabase, mapRowToSchedule, mapScheduleToRow } from '../lib/supabase';
import { loadSchedules, saveSchedules } from '../utils/storage';

const TABLE_NAME = 'evangelism_schedules';

export const fetchAllSchedules = async (): Promise<EvangelismSchedule[]> => {
  const supabase = getSupabase();
  if (!supabase) {
    return loadSchedules();
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error, fallback to local storage:', error.message);
      return loadSchedules();
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapRowToSchedule);
      saveSchedules(mapped); // keep local cache in sync
      return mapped;
    }

    // If table is empty, seed with initial sample data
    const initial = loadSchedules();
    if (initial.length > 0) {
      try {
        const rows = initial.map(mapScheduleToRow);
        await supabase.from(TABLE_NAME).upsert(rows);
      } catch (seedErr) {
        console.warn('Auto seed failed:', seedErr);
      }
    }
    return initial;
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    return loadSchedules();
  }
};

export const createSchedule = async (schedule: EvangelismSchedule): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  try {
    const row = mapScheduleToRow(schedule);
    const { error } = await supabase.from(TABLE_NAME).insert([row]);
    if (error) {
      console.error('Supabase insert error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase create failed:', err);
    return false;
  }
};

export const updateSchedule = async (schedule: EvangelismSchedule): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  try {
    const row = mapScheduleToRow(schedule);
    const { error } = await supabase
      .from(TABLE_NAME)
      .update(row)
      .eq('id', schedule.id);

    if (error) {
      console.error('Supabase update error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase update failed:', err);
    return false;
  }
};

export const deleteSchedule = async (id: string): Promise<boolean> => {
  const supabase = getSupabase();
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase delete failed:', err);
    return false;
  }
};

// ⚡ Realtime Subscription to Supabase Postgres Changes
export const subscribeToScheduleChanges = (
  onPayloadChange: (payload: { eventType: 'INSERT' | 'UPDATE' | 'DELETE'; new?: EvangelismSchedule; old?: { id: string } }) => void
) => {
  const supabase = getSupabase();
  if (!supabase) {
    return () => {};
  }

  const channel = supabase
    .channel('realtime_evangelism_schedules')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: TABLE_NAME },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          onPayloadChange({
            eventType: 'INSERT',
            new: mapRowToSchedule(payload.new)
          });
        } else if (payload.eventType === 'UPDATE') {
          onPayloadChange({
            eventType: 'UPDATE',
            new: mapRowToSchedule(payload.new)
          });
        } else if (payload.eventType === 'DELETE') {
          onPayloadChange({
            eventType: 'DELETE',
            old: { id: String(payload.old.id) }
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
