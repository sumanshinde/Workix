import { useState, useEffect } from 'react';
import { experimentAPI } from '../services/api';

export function useExperiment(experimentName: string, userId: string = 'anonymous') {
  const [variant, setVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const res = await experimentAPI.getVariant(experimentName, userId);
        setVariant(res.variant);
      } catch (err) {
        setVariant('A'); // Fallback to control
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [experimentName, userId]);

  const trackConversion = async (revenue: number = 0) => {
    try {
      await experimentAPI.track(experimentName, userId, revenue);
    } catch (err) {
      console.error('Experiment tracking failed');
    }
  };

  return { variant, loading, trackConversion };
}
