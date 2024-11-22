import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = "https://xzdolpcdmpmtwvgdayyb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6ZG9scGNkbXBtdHd2Z2RheXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMDgxNDIsImV4cCI6MjA0Nzc4NDE0Mn0.v3Mj867J8wvxf8jkfIlGm6JJWEdqRGyoTZVmzOx0fHQ";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Auth helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error("Supabase error:", error);
    // toast.error(error.message || "Failed to sign in");
    throw new Error(error.message || "An unknown error occurred");
  }
  return data;
};

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Storage helpers
export const uploadImage = async (file: File, path: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { data, error } = await supabase.storage
    .from('properties')
    .upload(filePath, file);

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('properties')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (path: string) => {
  const { error } = await supabase.storage
    .from('properties')
    .remove([path]);

  if (error) throw error;
};

// Database helpers
export const getProperties = async (userId?: string) => {
  let query = supabase
    .from('properties')
    .select(`
      *,
      profiles:user_id (
        name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const addProperty = async (propertyData: any) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User is not authenticated");
  }

  console.log("User ID:", user.id); // Debugging user ID
  console.log("Property Data:", propertyData); // Debugging insert data

  if (!propertyData.user_id) {
    propertyData.user_id = user.id; // Ensure user_id is populated
  }

  const { data, error } = await supabase
    .from("properties")
    .insert([propertyData])
    .select()
    .single();

  if (error) {
    console.error("Supabase Insert Error:", error); // Debugging RLS issues
    throw error;
  }

  return data;
};


export const updateProperty = async (id: string, propertyData: any) => {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getAdvisorRequests = async () => {
  const { data, error } = await supabase
    .from('advisor_requests')
    .select(`
      *,
      properties (*),
      profiles:user_id (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createAdvisorRequest = async (requestData: any) => {
  const { data, error } = await supabase
    .from('advisor_requests')
    .insert([requestData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAdvisorRequest = async (id: string, updateData: any) => {
  const { data, error } = await supabase
    .from('advisor_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};