import {View, Text, Button, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useEffect, useState } from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";


export default function QRCodeRegister() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = () => {
        setLoading(true);
    }

    return (
        <SafeAreaProvider>
            <Text style={styles.title}>QRコード登録</Text>
            <TextInput
                placeholder="登録URL"
                value={url}
                onChangeText={setUrl}
                style={styles.input}
            />
            <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                style={styles.button}
            >
                <Text>登録</Text>
            </TouchableOpacity>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginTop: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: '#84cc16',
        padding: 10,
        margin: 10,
        alignItems: 'center',
    },
});
