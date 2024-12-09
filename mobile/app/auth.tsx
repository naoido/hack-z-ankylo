import React, { useState } from 'react';
import { Alert, AppState } from 'react-native';
import { supabase } from "./lib/supabase";
import { Button, Input } from '@rneui/themed';
import styled from '@emotion/native';

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

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
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