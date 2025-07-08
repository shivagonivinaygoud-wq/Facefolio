import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Group = Database['public']['Tables']['groups']['Row'];
type GroupInsert = Database['public']['Tables']['groups']['Insert'];
type GroupMember = Database['public']['Tables']['group_members']['Row'];
type GroupMemberInsert = Database['public']['Tables']['group_members']['Insert'];
type Photo = Database['public']['Tables']['photos']['Row'];
type PhotoInsert = Database['public']['Tables']['photos']['Insert'];

// Group operations
export const createGroup = async (groupData: Omit<GroupInsert, 'created_by'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('groups')
    .insert({ ...groupData, created_by: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGroups = async () => {
  const { data, error } = await supabase
    .from('groups')
    .select(`
      *,
      group_members(count),
      photos(count)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateGroup = async (id: string, updates: Partial<GroupInsert>) => {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGroup = async (id: string) => {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Group member operations
export const addGroupMember = async (memberData: Omit<GroupMemberInsert, 'id'>) => {
  const { data, error } = await supabase
    .from('group_members')
    .insert(memberData)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGroupMembers = async (groupId: string) => {
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateGroupMember = async (id: string, updates: Partial<GroupMemberInsert>) => {
  const { data, error } = await supabase
    .from('group_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteGroupMember = async (id: string) => {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Photo operations
export const uploadPhoto = async (file: File, groupId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('photos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('photos')
    .insert({
      group_id: groupId,
      uploaded_by: user.id,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// New function to update photo with detected faces
export const updatePhotoWithFaces = async (photoId: string, detectedFaces: any[]) => {
  const { data, error } = await supabase
    .from('photos')
    .update({
      detected_faces: detectedFaces
    })
    .eq('id', photoId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGroupPhotos = async (groupId: string) => {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('group_id', groupId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deletePhoto = async (id: string) => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
