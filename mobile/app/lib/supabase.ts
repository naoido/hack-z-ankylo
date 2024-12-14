import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { SUPABASE_BASE_URL, SUPABASE_PUBLIC_API_KEY } from "@env"

const spUrl = SUPABASE_BASE_URL
const spAnonKey = SUPABASE_PUBLIC_API_KEY

export const supabase = createClient(spUrl, spAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
