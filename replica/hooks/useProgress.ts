import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      const { data, error } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', userId);

      if (data) setProgress(data);
      setLoading(false);
    };

    fetchProgress();
  }, [userId]);

  const updateProgress = async (nodeId: string, status: string) => {
    const { data, error } = await supabase
      .from('user_lesson_progress')
      .upsert({ user_id: userId, node_id: nodeId, status });
    return { data, error };
  };

  return { progress, loading, updateProgress };
};
