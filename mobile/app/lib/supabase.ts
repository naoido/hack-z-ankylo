import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from "@env"

const spUrl = EXPO_PUBLIC_SUPABASE_URL
const spAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(spUrl, spAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
