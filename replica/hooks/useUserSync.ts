import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useUserSync = (userId: string | undefined) => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setProfile(data);
    };

    fetchProfile();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        setProfile(payload.new);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return { profile };
};
