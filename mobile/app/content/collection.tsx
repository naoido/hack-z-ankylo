import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const images = [
    require('../qrgame/DemoAsserts/image1.png'),
    require('../qrgame/DemoAsserts/image2.png'),
    require('../qrgame/DemoAsserts/image3.png'),
    require('../qrgame/DemoAsserts/image4.png'),
    require('../qrgame/DemoAsserts/image5.png'),
    require('../qrgame/DemoAsserts/image6.png'),
    require('../qrgame/DemoAsserts/image7.png'),
    require('../qrgame/DemoAsserts/image8.png'),
];

export default function Collection() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
    }, [useState()]);
    return (
        <SafeAreaProvider>
            <Text style={styles.title}>コレクション</Text>
            <View style={{alignItems: 'center'}}>
                <View style={styles.card}>
                <Image source={images[index]} style={styles.qr}></Image>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => setIndex(index + 1)}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIndex(index - 1)}>
                <Text style={styles.buttonText}>Prev</Text>
            </TouchableOpacity>
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
    card: {
        borderRadius: 5,
        borderWidth: 4,
        borderColor: 'black',
    },
    qr: {
        width: 400,
        height: 400,
        alignItems: 'center',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    image: {
        width: '30%',
        height: 100,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
});