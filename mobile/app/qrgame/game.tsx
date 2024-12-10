import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, Button, Image, Modal, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RTCPeerConnection } from "react-native-webrtc-web-shim";
import { setAlert } from '../lib/alert';
import styled from '@emotion/native';
import * as WebBrowser from 'expo-web-browser';
import { pc } from './matching';
import { useAtom } from 'jotai';

const GRID_SIZE = 4;

const images = [
    require('./DemoAsserts/image1.png'),
    require('./DemoAsserts/image2.png'),
    require('./DemoAsserts/image3.png'),
    require('./DemoAsserts/image4.png'),
    require('./DemoAsserts/image5.png'),
    require('./DemoAsserts/image6.png'),
    require('./DemoAsserts/image7.png'),
    require('./DemoAsserts/image8.png'),
];

const urls = [
    'https://nulab.com/',
    'https://cup.hackz.team/',
    'https://corp.wingarc.com',
    'https://prog-8.com/',
    'https://github.com/',
    'https://zenn.dev/',
    'https://www.apple.com/jp/swift/',
    'https://ja.quarkus.io/'
]

const generateGrid = () => {
    const numbers = [...Array(GRID_SIZE * GRID_SIZE).keys()];
    for (let i = 0; i < numbers.length; i++) {
        numbers[i] = Math.floor(i / 2);
    }
    return numbers.sort(() => Math.random() - 0.5);
};

const ImageModal = ({ visible, onClose, image, url }) => {


    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => handleOpenURL(), 1500);
            return () => clearTimeout(timer);
        }
    }, [visible]);
    const handleOpenURL = async () => {
        await WebBrowser.openBrowserAsync(url)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <SafeAreaProvider>
                <TouchableWithoutFeedback onPress={onClose}>
                    <ModalContainer>
                        <TouchableWithoutFeedback>
                            <ModalContent>
                                <Button title="Close" onPress={onClose} />
                                    <Image source={image} style={{ width: 400, height: 400 }} />
                            </ModalContent>
                        </TouchableWithoutFeedback>
                    </ModalContainer>
                </TouchableWithoutFeedback>
            </SafeAreaProvider>
        </Modal>
    );
};

export default function Game() {
    const [modalVisible, setModalVisible] = useState(false);
    const [grid, setGrid] = useState(generateGrid());
    const [flippedIndex, setFlippedIndex] = useState([]);
    const [matchedIndex, setMatchedIndex] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [url, setUrl] = useState('');
    const [connect] = useAtom<RTCPeerConnection>(pc);

    const handleTilePress = (index) => {;
        const channel = connect.createDataChannel("chat");
        if (channel.readyState === "open") {
            channel.send(index);
        } else {
            channel.onopen = () => {
                channel.send(index);
            };
        }
        connect.ondatachannel = (event) => {
            const channel = event.channel;
            channel.onmessage = (event) => {
                console.log("Message received on data channel:", event.data);
                const receivedIndex = parseInt(event.data, 10);
                setFlippedIndex((prevFlippedIndex) => [...prevFlippedIndex, receivedIndex]);
            };
        };
        if (flippedIndex.length < 2 && !flippedIndex.includes(index) && !matchedIndex.includes(index)) {
            const newFlippedIndex = [...flippedIndex, index];
            setFlippedIndex(newFlippedIndex);

            if (newFlippedIndex.length === 2) {
                const [firstIndex, secondIndex] = newFlippedIndex;
                if (grid[firstIndex] === grid[secondIndex]) {
                    const newMatchedIndex = [...matchedIndex, firstIndex, secondIndex];
                    setMatchedIndex(newMatchedIndex);
                    setSelectedImage(images[grid[firstIndex]]);
                    setUrl(urls[grid[firstIndex]]);
                    setModalVisible(true);
                } else {
                    setAlert('不正解です!', Platform.OS);
                }
                setTimeout(() => setFlippedIndex([]), 1000);
            }
        }
    };

    useEffect(() => {
        if (matchedIndex.length === GRID_SIZE * GRID_SIZE) {
            setAlert('クリア！', Platform.OS);
        }
    }, [matchedIndex]);

    const resetGame = () => {
        setGrid(generateGrid());
        setFlippedIndex([]);
        setMatchedIndex([]);
    };

    return (
        <MainContainer>
            <Text style={styles.title}>神経衰弱</Text>
            <Grid>
                {grid.map((num, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tile, matchedIndex.includes(index) && styles.matchedTile]}
                        onPress={() => handleTilePress(index)}
                        disabled={matchedIndex.includes(index)}
                    >
                        {flippedIndex.includes(index) || matchedIndex.includes(index) ? (
                            <Image source={images[num]} style={styles.image} />
                        ) : (
                            <Text style={styles.tileText}></Text>
                        )}
                    </TouchableOpacity>
                ))}
            </Grid>
            <Button title="リセット" onPress={resetGame} />
            <ImageModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                image={selectedImage}
                url={url}
            />
        </MainContainer>
    );
}


const MainContainer = styled.View`
    flex: 1px;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
`;

const Grid = styled.View`
    width: 400px;
    height: 400px;
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: 35px;
`

const ModalContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
    width: 400px;
    height: 600px;
    background-color: white;
    border-radius: 10px;
    align-items: center;
    margin-top: 50px;
`;

const styles = StyleSheet.create({
    modalText: {
        fontSize: 18,
        marginBottom: 10,
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
    tile: {
        width: 330 / GRID_SIZE,
        height: 330 / GRID_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333333',
        borderWidth: 1,
        borderColor: '#fff',
        margin: 4,
    },
    matchedTile: {
        backgroundColor: '#8bc34a',
    },
    tileText: {
        fontSize: 24,
        color: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
