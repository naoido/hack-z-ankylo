import { ApolloProvider, useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { accessTokenAtom, userIdAtom } from "../index";
import { client } from "../lib/graphql/client";
import { getQRcodes } from "../lib/graphql/query";
import Loading from "../utils/loading";

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 30;

const Collection = () => {
    const [accessToken] = useAtom(accessTokenAtom);
    const [userId] = useAtom(userIdAtom);
    const [getQR] = useMutation(getQRcodes);
    const [pageNum, setPageNum] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [qrcodeUrl, setQrCodeUrl] = useState("");
    const [qrcodeName, setQrCodeName] = useState("");
    const [qrcodeContent, setQrCodeContent] = useState("");
    const num = 8;

    const isValidURL = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
      };

    const openBrowser = () => {
        if (!isValidURL(qrcodeContent)) return;
        Linking.openURL(qrcodeContent).catch((err) =>
            console.error("Failed to open URL:", err)
        );
    };

    useEffect(() => {
        const fetchImages = async () => {
            setLoading(true);
            try {
                const { data } = await getQR({
                    variables: { page: pageNum, count: num, userId: userId },
                    context: { headers: { authorization: `Bearer ${accessToken}` } }
                });
                if (data && data.getQrCodes) {
                    setImages((prevImages) => [...prevImages, ...data.getQrCodes.qrcodes]);
                }
                console.log(data);
            } catch (error) {
                console.log(error)
                console.error("Error fetching QR codes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [pageNum, accessToken, userId, getQR]);

    const handlePageChange = (direction) => {
        setImages([]);
        if (direction === 'next') {
            setPageNum((prev) => prev + 1);
        } else if (direction === 'prev' && pageNum > 1) {
            setPageNum((prev) => prev - 1);
        }
    };

    return (
        <SafeAreaProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>コレクション</Text>
                <View style={styles.grid}>
                    {images.map((item, i) => (
                        <TouchableOpacity key={i} style={styles.card} onPress={() => {
                                setQrCodeUrl(item.qrcode_url);
                                setQrCodeName(item.qrcode_name);
                                setQrCodeContent(item.qrcode_content);
                                setModalVisible(true);
                            }}>
                            <Image source={{ uri: item.qrcode_url }} style={styles.qr} />
                            <Text style={styles.itemTitle}>{item.qrcode_content}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Image source={{ uri: qrcodeUrl }} style={styles.qr} />
                            <Text style={styles.modalName}>
                                { qrcodeName }
                            </Text>
                            <Text 
                                style={styles.modalLink}  
                                numberOfLines={1} 
                                ellipsizeMode="tail"
                                onPress={openBrowser}>
                                { qrcodeContent }
                            </Text>
                            <View style={styles.modalClose}>
                                <Button title="閉じる" onPress={() => setModalVisible(false)}/>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
            {loading ? (
                <Loading />
            ) : (
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => handlePageChange('prev')} disabled={pageNum === 1}>
                        <Text style={{ color: pageNum === 1 ? 'gray' : 'blue' }}>前へ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePageChange('next')}>
                        <Text style={{ color: 'blue' }}>次へ</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaProvider>
    );
};

export default function CollectionWrapper() {
    return (
        <ApolloProvider client={client}>
            <Collection />
        </ApolloProvider>
    );
}

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
    modalName: {
        width: "80%",
        textAlign: "center",
        color: "#272727",
        fontSize: 20
    },
    modalLink: {
        width: "80%",
        textAlign: "center",
        color: "#aaa",
        fontSize: 18
    },
    modalClose: {
        marginTop: 20,
    },
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F0F0',
        paddingVertical: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    card: {
        width: itemWidth,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    qr: {
        width: itemWidth - 20,
        height: itemWidth - 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
