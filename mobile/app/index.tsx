import { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { atom, useAtom } from 'jotai';
import { supabase } from "./lib/supabase";
import { Session } from '@supabase/supabase-js';

export const sessionAtom = atom<Session | null>();
export const userAtom = atom<any | null>();
export const accessTokenAtom = atom<string | null>();
export const userIdAtom = atom<string | null>();

export default function App() {
  const [session, setSession] = useAtom(sessionAtom);
  const [user, setUser] = useAtom(userAtom);
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom);
  const [user_id, setUserId] = useAtom(userIdAtom);
  const router = useRouter();


  const handleDatabase = async (s) => {
    const { data, error, status } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', s?.user.id)
        .single();
    setUser(data);
    console.log(data);
  };

  useEffect(() => {
    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await handleDatabase(session);
      setAccessToken(session.access_token);
      setUserId(session.user.id);
      if (session && session.user) {
        router.push('/content/home');
      } else {
        router.push('/auth');
      }
    };

    initializeSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      await handleDatabase(session);
      console.log(session);
      if (session && session.user) {
        router.push('/content/home');
      } else {
        router.push('/auth');
      }
    });

    return () => {
      ""
    };
  }, []);

  return <View/>;
}