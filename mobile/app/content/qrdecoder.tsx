import React, {useState} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Text, Image, TextInput, Button, Platform} from "react-native";
import {StyleSheet} from "react-native";
import {setAlert} from "../lib/alert";

const image = require('../qrgame/DemoAsserts/image1.png');
const url = 'https://nulab.com/';

export default function QrDecoder() {
    const [answer, setAnswer] = useState('');

    const checkAnswer = () => {
        if (answer === url) {
            setAlert('正解！', Platform.OS);
        } else {
            setAlert('不正解', Platform.OS);
        }
    };

    return (
        <SafeAreaProvider>
            <Text style={styles.title}>QR解析ゲーム</Text>
            <Image source={image} style={styles.image}></Image>
            <TextInput value={answer} onChangeText={setAnswer} style={styles.input}></TextInput>
            <Button title="Submit" onPress={checkAnswer}></Button>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginTop: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    image: {
        width: 400,
        height: 400,
        alignItems: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});