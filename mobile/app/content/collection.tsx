import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const images = [
    { source: require('../qrgame/DemoAsserts/image1.png'), title: 'Item 1' },
    { source: require('../qrgame/DemoAsserts/image2.png'), title: 'Item 2' },
    { source: require('../qrgame/DemoAsserts/image3.png'), title: 'Item 3' },
    { source: require('../qrgame/DemoAsserts/image4.png'), title: 'Item 4' },
    { source: require('../qrgame/DemoAsserts/image5.png'), title: 'Item 5' },
    { source: require('../qrgame/DemoAsserts/image6.png'), title: 'Item 6' },
    { source: require('../qrgame/DemoAsserts/image7.png'), title: 'Item 7' },
    { source: require('../qrgame/DemoAsserts/image8.png'), title: 'Item 8' },
];

const { width } = Dimensions.get('window');
const itemWidth = width / 2 - 30;

export default function Collection() {
    return (
        <SafeAreaProvider>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>コレクション</Text>
                <View style={styles.grid}>
                    {images.map((item, i) => (
                        <View key={i} style={styles.card}>
                            <Image source={item.source} style={styles.qr} />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F0F0',
        paddingVertical: 20,
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

