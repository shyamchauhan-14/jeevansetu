import { supabase, isSupabaseConfigured } from './supabaseClient';

export type UserRole = 'patient' | 'community_worker' | 'administrator' | 'clinician_reviewer';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  isGuest: boolean;
}

const LOCAL_GUEST_USER: AuthUser = {
  id: 'guest_local_user',
  email: 'guest@jeevansetu.local',
  displayName: 'Local Guest Patient',
  role: 'patient',
  isGuest: true
};

const STORAGE_KEYS = {
  SESSION_CACHE: 'jeevansetu_cached_auth_user',
  USER_ROLE: 'jeevansetu_user_role'
};

export class AuthService {
  private static currentUser: AuthUser | null = null;
  private static authListeners: Array<(user: AuthUser | null) => void> = [];

  /**
   * Initializes the auth state and subscribes to Supabase auth events
   */
  public static async init(): Promise<AuthUser> {
    if (!isSupabaseConfigured || !supabase) {
      this.currentUser = this.getCachedGuestOrStoredUser();
      return this.currentUser;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        this.currentUser = this.getCachedGuestOrStoredUser();
      } else {
        const user = session.user;
        const role = await this.fetchUserRole(user.id);
        this.currentUser = {
          id: user.id,
          email: user.email || '',
          displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
          role,
          isGuest: false
        };
        this.cacheAuthUser(this.currentUser);
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const role = await this.fetchUserRole(session.user.id);
          this.currentUser = {
            id: session.user.id,
            email: session.user.email || '',
            displayName: session.user.user_metadata?.display_name || 'User',
            role,
            isGuest: false
          };
          this.cacheAuthUser(this.currentUser);
        } else {
          this.currentUser = LOCAL_GUEST_USER;
          localStorage.removeItem(STORAGE_KEYS.SESSION_CACHE);
        }
        this.notifyListeners(this.currentUser);
      });

    } catch (err) {
      console.warn('[AuthService] Could not contact Supabase auth, defaulting to guest:', err);
      this.currentUser = this.getCachedGuestOrStoredUser();
    }

    return this.currentUser;
  }

  public static getCurrentUser(): AuthUser {
    if (!this.currentUser) {
      this.currentUser = this.getCachedGuestOrStoredUser();
    }
    return this.currentUser;
  }

  public static async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Running in offline/guest mode.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const role = await this.fetchUserRole(data.user.id);
        this.currentUser = {
          id: data.user.id,
          email: data.user.email || '',
          displayName: data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'User',
          role,
          isGuest: false
        };
        this.cacheAuthUser(this.currentUser);
        this.notifyListeners(this.currentUser);
        await this.logAuditEvent('user_signin', 'auth_users', data.user.id);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }

  public static async signUp(email: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Supabase is not configured. Running in offline/guest mode.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Assign default patient role
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'patient'
        });

        // Initialize profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          display_name: displayName,
          preferred_language: 'en'
        });

        await this.logAuditEvent('user_signup', 'auth_users', data.user.id);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Sign up failed' };
    }
  }

  public static async signOut(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    this.currentUser = LOCAL_GUEST_USER;
    localStorage.removeItem(STORAGE_KEYS.SESSION_CACHE);
    this.notifyListeners(this.currentUser);
  }

  public static onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    this.authListeners.push(callback);
    return () => {
      this.authListeners = this.authListeners.filter((cb) => cb !== callback);
    };
  }

  private static notifyListeners(user: AuthUser | null): void {
    this.authListeners.forEach((cb) => {
      try {
        cb(user);
      } catch (e) {
        console.error('[AuthService] Listener error:', e);
      }
    });
  }

  public static async fetchUserRole(userId: string): Promise<UserRole> {
    if (!supabase) return 'patient';

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error || !data) return 'patient';
      return data.role as UserRole;
    } catch {
      return 'patient';
    }
  }

  public static async logAuditEvent(action: string, targetType: string, targetId?: string): Promise<void> {
    if (!supabase) return;
    try {
      const user = this.getCurrentUser();
      await supabase.from('audit_events').insert({
        actor_user_id: user.isGuest ? null : user.id,
        action,
        target_type: targetType,
        target_id: targetId || null
      });
    } catch (err) {
      // Non-blocking
      console.warn('[Audit] Log error:', err);
    }
  }

  private static getCachedGuestOrStoredUser(): AuthUser {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.SESSION_CACHE);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // fallback
    }
    return LOCAL_GUEST_USER;
  }

  private static cacheAuthUser(user: AuthUser): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_CACHE, JSON.stringify(user));
    } catch {
      // ignore
    }
  }
}
