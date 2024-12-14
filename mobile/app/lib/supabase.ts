import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const spUrl = process.env.EXPO_PUBLIC_SUPABASE_BASE_URL
const spAnonKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_API_KEY

export const supabase = createClient(spUrl, spAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
