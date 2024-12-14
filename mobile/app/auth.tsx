import React, { useState } from 'react';
import { Alert, AppState } from 'react-native';
import { supabase } from "./lib/supabase";
import { Button, Input } from '@rneui/themed';
import styled from '@emotion/native';
import { Platform } from 'react-native';
import { setAlert } from './lib/alert';
import { useRouter } from 'expo-router';

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh();
    } else {
        supabase.auth.stopAutoRefresh();
    }
});

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) setAlert(error.message, Platform.OS)
        else {
            setAlert("ログイン成功", Platform.OS)
            setLoading(false)
            router.push("/")
        }
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) setAlert(error.message, Platform.OS)
        if (!session) setAlert("メールを確認ください", Platform.OS)
        setLoading(false)
    }

    return (
        <Container>
            <TopContainer>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </TopContainer>
            <BottomContainer>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </BottomContainer>
            <TopContainer>
                <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
            </TopContainer>
            <BottomContainer>
                <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
            </BottomContainer>
        </Container>
    );
}

const Container = styled.View`
    margin-top: 40px;
    padding: 12px;
`;

const TopContainer = styled.View`
    padding-top: 4px;
    padding-bottom: 4px;
    align-self: stretch;
    margin-top: 20px;
`;

const BottomContainer = styled.View`
    padding-top: 4px;
    padding-bottom: 4px;
    align-self: stretch;
`;