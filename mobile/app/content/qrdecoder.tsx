import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Image, TextInput, Platform, TouchableOpacity, Dimensions } from "react-native";
import { StyleSheet } from "react-native";
import { setAlert } from "../lib/alert";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

const image = require('../qrgame/DemoAsserts/image1.png');
const url = 'https://nulab.com/';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function QrDecoder() {
    const [answer, setAnswer] = useState('');
    const buttonScale = useSharedValue(1);
    const imageScale = useSharedValue(0.8);

    useEffect(() => {
        imageScale.value = withSpring(1);
    }, []);

    const checkAnswer = () => {
        if (answer === url) {
            setAlert('正解！', Platform.OS);
        } else {
            setAlert('不正解', Platform.OS);
        }
    };

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: buttonScale.value }],
        };
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: imageScale.value }],
        };
    });

    const onPressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 100, easing: Easing.inOut(Easing.ease) });
    };

    const onPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 100, easing: Easing.inOut(Easing.ease) });
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <Text style={styles.title}>QR解析ゲーム</Text>
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
                <Image source={image} style={styles.image} resizeMode="contain" />
            </Animated.View>
            <TextInput
                value={answer}
                onChangeText={setAnswer}
                style={styles.input}
                placeholder="答えを入力"
                placeholderTextColor="#999"
            />
            <AnimatedTouchableOpacity
                style={[styles.button, buttonAnimatedStyle]}
                onPress={checkAnswer}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
            >
                <Text style={styles.buttonText}>確認</Text>
            </AnimatedTouchableOpacity>
        </SafeAreaProvider>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    title: {
        fontSize: 28,
        marginTop: 20,
        marginBottom: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#84cc16',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 30,
        backgroundColor: 'white',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: width * 0.8,
        height: width * 0.8,
        maxWidth: 400,
        maxHeight: 400,
    },
    input: {
        height: 50,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#84cc16',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#84cc16',
        borderRadius: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

