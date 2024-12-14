import { ApolloProvider, useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import { useState } from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { accessTokenAtom } from "../index";
import { client } from "../lib/graphql/client";
import { registQRcode } from "../lib/graphql/query";
import { launchImageLibrary } from 'react-native-image-picker';

const QRCodeRegister = () => {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [userImage, setUserImage] = useState('');
    const [uploadImage, setUploadImage] = useState('');
    const [image, setImage] = useState('');

    const [registerQRcode, {data}] = useMutation(registQRcode);
    const [accessToken] = useAtom(accessTokenAtom);

    const choosePhoto = () => {
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, (response) => {
            setUserImage(response.assets[0].uri);
            setUploadImage(response.assets[0].base64);
            console.log("");
            console.log(response.assets[0].base64);
            console.log("")
            console.log(response.assets[0].uri);
            console.log("")
            console.log(response.assets[0].fileName);
            console.log("")
            console.log(response.assets[0].originalPath);
        });
    }


    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await registerQRcode({
                variables: {content: url, qrcode_name: name},
                context: {headers: {authorization: `Bearer ${accessToken}`}}
            });
            setImage(response.data.generateQrCode.qrcode_url)
            setUrl("");
            setName("");
            Keyboard.dismiss();
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
            {!userImage &&
            <TouchableOpacity onPress={choosePhoto} style={styles.button}>
                <Text>画像選択</Text>
            </TouchableOpacity>
            }
            {userImage &&
                <View style={{alignItems: 'center'}}>
                    <Image source={{ uri: userImage }} style={styles.image} />
                </View>
            }
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