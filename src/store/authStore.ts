import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';
import toast from 'react-hot-toast';

const ADMIN_EMAIL = 'admin@investoriq.com';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email, password) => {
    try {
      const { data: { user } } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!user) throw new Error('No user found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userData: User = {
        id: user.id,
        email: user.email!,
        name: profile?.name || email.split('@')[0],
        role: isAdmin ? 'admin' : 'user',
        avatar: profile?.avatar_url,
      };

      set({ user: userData });
      toast.success(`Welcome back, ${userData.name}!`);
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      throw error;
    }
  },
  signUp: async (email, password, name) => {
    try {
      const { data: { user } } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (!user) throw new Error('No user created');

      const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userData: User = {
        id: user.id,
        email: user.email!,
        name,
        role: isAdmin ? 'admin' : 'user',
      };

      await supabase.from('profiles').insert([{
        id: user.id,
        name,
        email: user.email,
      }]);

      set({ user: userData });
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      throw error;
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null });
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  },
  checkAuth: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const isAdmin = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const userData: User = {
          id: user.id,
          email: user.email!,
          name: profile?.name || user.email!.split('@')[0],
          role: isAdmin ? 'admin' : 'user',
          avatar: profile?.avatar_url,
        };

        set({ user: userData, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ user: null, loading: false });
    }
  },
}));