
import { Database } from '@/integrations/supabase/types';

export type Group = Database['public']['Tables']['groups']['Row'] & {
  photoCount?: number;
  memberCount?: number;
  photos?: any[];
  group_members?: any[];
};

export type Member = {
  id: string;
  name: string;
  phoneNumber: string;
  profilePicture?: string;
};

export type Photo = Database['public']['Tables']['photos']['Row'];
