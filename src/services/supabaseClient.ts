import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MedicineReminder } from '../types/health';
import { AuthService } from './authService';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// Database Row Mapping
interface MedicineReminderRow {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  time_slot: string;
  time: string;
  meal_instruction: string;
  status?: string;
  last_taken_date: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

function mapRowToReminder(row: MedicineReminderRow): MedicineReminder {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    dosage: row.dosage,
    timeSlot: row.time_slot as 'morning' | 'afternoon' | 'night',
    time: row.time,
    mealInstruction: row.meal_instruction as 'before_meal' | 'after_meal' | 'with_meal',
    status: (row.status as 'pending' | 'taken' | 'skipped' | 'snoozed') || 'pending',
    lastTakenDate: row.last_taken_date || undefined,
    isActive: row.is_active,
    createdAt: row.created_at
  };
}

function mapReminderToRow(reminder: MedicineReminder, validatedUserId: string): MedicineReminderRow {
  return {
    id: reminder.id,
    user_id: validatedUserId,
    name: reminder.name,
    dosage: reminder.dosage,
    time_slot: reminder.timeSlot,
    time: reminder.time,
    meal_instruction: reminder.mealInstruction,
    status: reminder.status || 'pending',
    last_taken_date: reminder.lastTakenDate || null,
    is_active: reminder.isActive,
    updated_at: new Date().toISOString()
  };
}

export class SupabaseService {
  /**
   * Fetch all medicine reminders for authenticated user
   */
  public static async fetchReminders(): Promise<MedicineReminder[] | null> {
    if (!supabase) return null;

    const user = AuthService.getCurrentUser();
    if (user.isGuest) {
      // Guest users use offline local storage, no cloud database query
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('medicine_reminders')
        .select('*')
        .eq('user_id', user.id)
        .order('time', { ascending: true });

      if (error) {
        console.warn('[Supabase] Failed to fetch reminders:', error.message);
        return null;
      }

      return (data as MedicineReminderRow[]).map(mapRowToReminder);
    } catch (err) {
      console.warn('[Supabase] Network/fetch error:', err);
      return null;
    }
  }

  /**
   * Upsert a reminder into Supabase with session-derived user_id (never client-trusted)
   */
  public static async upsertReminder(reminder: MedicineReminder): Promise<boolean> {
    if (!supabase) return false;

    const user = AuthService.getCurrentUser();
    if (user.isGuest) {
      return false;
    }

    try {
      const row = mapReminderToRow(reminder, user.id);
      const { error } = await supabase.from('medicine_reminders').upsert(row);

      if (error) {
        console.warn('[Supabase] Failed to upsert reminder:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] Upsert error:', err);
      return false;
    }
  }

  /**
   * Delete a reminder from Supabase with owner validation
   */
  public static async deleteReminder(id: string): Promise<boolean> {
    if (!supabase) return false;

    const user = AuthService.getCurrentUser();
    if (user.isGuest) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('medicine_reminders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.warn('[Supabase] Failed to delete reminder:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] Delete error:', err);
      return false;
    }
  }

  /**
   * Save an emergency incident
   */
  public static async saveIncident(incident: {
    id: string;
    status: string;
    locality?: string;
    latitude?: number;
    longitude?: number;
    emergencyType?: string;
    alertStatus?: string;
  }): Promise<boolean> {
    if (!supabase) return false;

    const user = AuthService.getCurrentUser();

    try {
      const { error } = await supabase.from('emergency_incidents').insert({
        id: incident.id,
        user_id: user.isGuest ? null : user.id,
        status: incident.status,
        locality: incident.locality || 'Manual Location Fallback',
        latitude: incident.latitude || null,
        longitude: incident.longitude || null,
        emergency_type: incident.emergencyType || 'general',
        alert_status: incident.alertStatus || 'none'
      });

      if (error) {
        console.warn('[Supabase] Failed to log emergency incident:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[Supabase] Save incident error:', err);
      return false;
    }
  }
}
