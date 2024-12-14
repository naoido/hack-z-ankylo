import {View, Text, Image, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import { useEffect, useState } from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import { ApolloProvider, useMutation } from "@apollo/client";
import { client } from "../lib/graphql/client";
import {getQRcodes, registQRcode} from "../lib/graphql/query";
import {accessTokenAtom, userIdAtom} from "../index"
import { useAtom } from "jotai";

const QRCodeRegister = () => {
    const [url, setUrl] = useState('beko');
    const [name, setName] = useState('eee');
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState('');

    const [registerQRcode, {data}] = useMutation(registQRcode);
    const [accessToken] = useAtom(accessTokenAtom);


    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await registerQRcode({
                variables: {content: url, qrcode_name: name},
                context: {headers: {authorization: `Bearer ${accessToken}`}}
            });
            setImage(response.data.generateQrCode.qrcode_url)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaProvider>
            <Text style={styles.title}>QRコード登録</Text>
            <TextInput
                placeholder="サイト名"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
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
            <View style={styles.qrcontainer}>
                {image && (
                    <View style={styles.layout}>
                        <Image source={{ uri: image }} style={styles.image} />
                    </View>
                )}
            </View>

        </SafeAreaProvider>
    );
};

export default function Wrapper() {
    return (
        <ApolloProvider client={client}>
            <QRCodeRegister />
        </ApolloProvider>
    );
}

const styles = StyleSheet.create({
    qrcontainer: {
        alignItems: "center",
        paddingTop: 10,
    },
    layout: {
        width: 400,
        height: 400,
        alignItems: 'center',
        borderWidth: 10,
        padding: 10
    },
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
    image: {
        marginTop: 30,
        width: 300,
        height: 300,
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