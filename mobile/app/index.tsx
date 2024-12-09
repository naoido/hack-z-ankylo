import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { supabase } from "./lib/supabase";

export const sessionAtom = atom();

export default function App() {
  const [session, setSession] = useAtom(sessionAtom);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && session.user) {
        router.push('/content/home');
      } else {
        router.push('/auth');
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session && session.user) {
        router.push('/content/home');
      } else {
        router.push('/auth');
      }
    });
  }, []);

  return <View/>;
}