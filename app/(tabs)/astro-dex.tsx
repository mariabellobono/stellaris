import React, { useEffect, useState } from 'react';
import { AstroDexScreen } from '../../components/AstroDexScreen';
import { supabase } from '../../services/supabase';

export default function AstroDexTab() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
      }
    });
  }, []);

  return <AstroDexScreen userId={userId} />;
}
