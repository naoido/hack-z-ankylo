import { View } from "react-native";
import { supabase } from "../lib/supabase";

export default function WrapperDecorer(){
    supabase.auth.signOut();
    
    return (
        <View />
    );
}