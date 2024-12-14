import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
    View,
    Text,
    Image,
    TextInput,
    Platform,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback, Button
} from "react-native";
import { StyleSheet } from "react-native";
import { setAlert } from "../lib/alert";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing, withSequence, withRepeat } from 'react-native-reanimated';
import {useAtom} from "jotai/index";
import {accessTokenAtom, userIdAtom} from "../index";
import {ApolloProvider, useMutation} from "@apollo/client";
import {getQRcodes} from "../lib/graphql/query";
import {client} from "../lib/graphql/client";

const url = 'https://nulab.com/';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const QrDecoder = () =>{
    const [answer, setAnswer] = useState('');
    const buttonScale = useSharedValue(1);
    const tipsScale = useSharedValue(0);
    const imageScale = useSharedValue(0.8);
    const textScale = useSharedValue(0);
    const [accessToken] = useAtom(accessTokenAtom);
    const [loading, setLoading] = useState(false);
    const [userId] = useAtom(userIdAtom);
    const [getQR] = useMutation(getQRcodes);
    const [pageNum, setPageNum] = useState(1);
    const [images, setImages] = useState([]);
    const [randomImage, setRandomImage] = useState(null);
    const num = 8;
    const [count, setCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (count === 0) {
            tipsScale.value = withRepeat(withSequence(withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }), withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })), 10);
        }
        imageScale.value = withSpring(1);
        const fetchImages = async () => {
            setLoading(true);
            try {
                const { data } = await getQR({
                    variables: { page: pageNum, count: num, userId: userId },
                    context: { headers: { authorization: `Bearer ${accessToken}` } }
                });
                if (data && data.getQrCodes) {
                    const newImages = data.getQrCodes.qrcodes;
                    setImages((prevImages) => [...prevImages, ...newImages]);
                    setRandomImage(newImages[Math.floor(Math.random() * newImages.length)]);
                }
            } catch (error) {
                console.error("Error fetching QR codes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [pageNum, accessToken, userId, getQR, count]);

    const checkAnswer = () => {
        if (answer === url) {
            setCount(count + 1);
            console.log(count);
            setAlert('正解！', Platform.OS);
        } else {
            setCount(count + 1);
            console.log(count);
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

    const displayAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: tipsScale.value }],
        };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: textScale.value }],
        };
    });

    const onPressIn = () => {
        buttonScale.value = withTiming(0.95, { duration: 1000, easing: Easing.inOut(Easing.ease) });
    };

    const onPressOut = () => {
        buttonScale.value = withTiming(1, { duration: 100, easing: Easing.inOut(Easing.ease) });
    };

    const showText = () => {
        textScale.value = withTiming(5, { duration: 4000, easing: Easing.inOut(Easing.ease) });
    };

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handlePress = () => {
        openModal();
        showText();
    };

    return (
        <SafeAreaProvider style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>QR解析ゲーム</Text>
                <AnimatedTouchableOpacity style={[styles.button, displayAnimatedStyle]} onPress={handlePress} >
                    <Text>お助け</Text>
                </AnimatedTouchableOpacity>
            </View>
            <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
                {randomImage && (
                    <Image source={{ uri: randomImage.qrcode_url }} style={styles.image} resizeMode="contain" />
                )}
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <SafeAreaProvider>
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <Button title="Close" onPress={closeModal} />
                                    <Animated.Text style={[styles.help, textAnimatedStyle]}>がんばれ</Animated.Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaProvider>
            </Modal>
        </SafeAreaProvider>
    );
}

export default function WrapperDecorer(){
    return (
        <ApolloProvider client={client}>
            <QrDecoder />
        </ApolloProvider>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        padding: 20,
    },
    help: {
        fontSize: 60,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        marginTop: 20,
        marginBottom: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        marginHorizontal: 20,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
});