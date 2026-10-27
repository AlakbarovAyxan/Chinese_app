import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useGamification = (userId: string | undefined) => {
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchGamification = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('streak_count, hearts_balance')
        .eq('id', userId)
        .single();

      if (data) {
        setStreak(data.streak_count);
        setHearts(data.hearts_balance);
      }
      setLoading(false);
    };

    fetchGamification();

    const channel = supabase
      .channel('gamification-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        setStreak(payload.new.streak_count);
        setHearts(payload.new.hearts_balance);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const updateStreak = async (increment: number) => {
    const { error } = await supabase
        .from('profiles')
        .update({ streak_count: streak + increment })
        .eq('id', userId);
    return !error;
  };

  return { streak, hearts, loading, updateStreak };
};
