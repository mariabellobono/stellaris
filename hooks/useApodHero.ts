import { useEffect, useState } from 'react';
import { NasaApod } from '../types';
import { fetchNasaApod } from '../services/api/nasa';

export function useApodHero() {
  const [apod, setApod] = useState<NasaApod | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchNasaApod()
      .then((data) => setApod(data))
      .finally(() => setLoading(false));
  }, []);

  return {
    apod,
    loading,
    modalVisible,
    setModalVisible,
  };
}
