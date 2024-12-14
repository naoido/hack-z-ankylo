import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider, useMutation } from "@apollo/client";
import { client } from "../lib/graphql/client";
import { getQRcodes } from "../lib/graphql/query";
import { accessTokenAtom, userIdAtom } from "../index";
import { useAtom } from "jotai";

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 30;

const Collection = () => {
    const [accessToken] = useAtom(accessTokenAtom);
    const [userId] = useAtom(userIdAtom);
    const [getQR] = useMutation(getQRcodes);
    const [pageNum, setPageNum] = useState(1);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const num = 8;

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
            } catch (error) {
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
                        <View key={i} style={styles.card}>
                            <Image source={{ uri: item.qrcode_url }} style={styles.qr} />
                            <Text style={styles.itemTitle}>{item.qrcode_content}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {loading ? (
                <Text style={{ textAlign: 'center', marginVertical: 10 }}>Loading...</Text>
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
