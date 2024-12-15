import { ApolloProvider, useMutation } from '@apollo/client';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { accessTokenAtom, userIdAtom } from '../index';
import { client } from '../lib/graphql/client';
import { getQRcodes } from '../lib/graphql/query';
import Loading from '../utils/loading';

const GRID_SIZE = 4;

const generateGrid = () => {
    const numbers = [...Array(GRID_SIZE * GRID_SIZE).keys()];
    numbers.sort(() => Math.random() - 0.5);
    return numbers;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const SlidControllerView = () => {
    const [accessToken] = useAtom(accessTokenAtom);
    const [userId] = useAtom(userIdAtom);
    const [loading, setLoading] = useState(false);
    const [getQR] = useMutation(getQRcodes);
    const [pageNum, setPageNum] = useState(1);
    const [images, setImages] = useState([]);
    const [grid, setGrid] = useState(generateGrid());
    const [randomImage, setRandomImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const scale = useSharedValue(0.8)

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const { data } = await getQR({
                    variables: { page: pageNum, count: 8, userId: userId },
                    context: { headers: { authorization: `Bearer ${accessToken}` } }
                });
                if (data && data.getQrCodes) {
                    const newImages = data.getQrCodes.qrcodes;
                    setImages((prevImages) => [...prevImages, ...newImages]);
                    setRandomImage(newImages[Math.floor(Math.random() * newImages.length)].qrcode_url);
                }
            } catch (error) {
                console.error("Error fetching QR codes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [pageNum, accessToken, userId, getQR]);

    useEffect(() => {
        scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) })
    }, []);

    const buttonAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{scale: scale.value}],
        };
    })

    const handleTilePress = (index) => {
        const emptyIndex = grid.indexOf(15);
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
        const emptyCol = emptyIndex % GRID_SIZE;


        if (Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1) {
            const newGrid = [...grid];
            [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
            setGrid(newGrid);

            if (checkWin(newGrid)) {
                if (Platform.OS === 'web') {
                    alert('🎉 おめでとう！パズルクリア！');
                }
                else {
                    Alert.alert('🎉 おめでとう！パズルクリア！');
                }
            }
        }
    };

    const checkWin = (grid) => {
        for (let i = 0; i < grid.length - 1; i++) {
            if (grid[i] !== i + 1) return false;
        }
        return true;
    };

    const resetGame = () => {
        setGrid(generateGrid());
    };

    return (
        <View style={styles.container}>
            {loading && <Loading />}
            <Text style={styles.title}>スライドパズル</Text>
            <Animated.View style={styles.button}>
                <Text onPress={() => setModalVisible(true)}>ヒント</Text>
            </Animated.View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image source={{ uri: randomImage }} style={styles.qr} />
                            <View style={styles.modalClose}>
                                <Button title="閉じる" onPress={() => setModalVisible(false)}/>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <View style={styles.grid}>
            {grid.map((num, index) => {
                const row = Math.floor(num / 4) * (300 / 4);
                const col = (num % 4) * (300 / 4);
                return (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tile, num === 15 && styles.emptyTile]}
                        onPress={() => handleTilePress(index)}
                        disabled={num === 15}
                        >
                        {num !== 15 && (
                            <Image
                            source={{uri: randomImage}}
                            style={[
                                {
                                resizeMode: 'cover',
                                width: 300,
                                height: 300,
                                position: 'absolute',
                                top: -row,
                                left: -col,
                                },
                            ]}
                            />
                        )}
                    </TouchableOpacity>
                    );
                    })
                }
            </View>
            <Button title="リセット" onPress={resetGame} />
        </View>
    );
}

export default function Slide() {
   return (
   <ApolloProvider client={client}>
        <SlidControllerView />
   </ApolloProvider>)
};

const styles = StyleSheet.create({
    centeredView: {
        height: "100%",
        width: "100%",
        backgroundColor: "#000000AA",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    modalView: {
        height: 500,
        width: "80%",
        backgroundColor: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    qr: {
        height: 200,
        width: 200
    },
    modalClose: {
        marginTop: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        width: 300,
        height: 300,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tile: {
        width: 300 / GRID_SIZE,
        height: 300 / GRID_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: '#fff',
    },
    emptyTile: {
        backgroundColor: '#4287f5',
    },
    tileText: {
        fontSize: 24,
        color: '#fff',
    },
    button: {
        textAlign: "center",
        height: 30
    }
});