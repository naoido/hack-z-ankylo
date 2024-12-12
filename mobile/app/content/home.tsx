import React from 'react';
import {View, Text, Button, StyleSheet, Pressable, Image, TouchableOpacity, ScrollView} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { sessionAtom, userAtom } from "../index";
import { useAtom } from 'jotai';
import Icon from "react-native-vector-icons/Feather";

const Separator = () => <View style={styles.separator} />;

export default function Home() {
    const router = useRouter();
    const [session] = useAtom(sessionAtom);
    const [User] = useAtom(userAtom);
    console.log(User);
    const features = [
        { name: 'QR 神経衰弱', icon: 'grid', route: '../qrgame/matching' },
        { name: 'スライドパズル', icon: 'move', route: './slide'},
        { name: 'QR 解読', icon: 'search', route: './qrdecoder' },
        { name: 'QR コード登録', icon: 'plus-square', route: './qrcoderegister' },
        { name: 'コレクション', icon: 'layout' , route: './collection'},
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.mainContent}>
                    <View style={styles.grid}>
                        {features.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.card}
                                onPress={() => router.push(item.route)}
                            >
                                <Icon name={item.icon} size={32} color="#84cc16" />
                                <Text style={styles.cardText}>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        padding: 10,
        margin: 10,
    },
    mainContent: {
        flexGrow: 1,
        padding: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardText: {
        marginTop: 8,
        textAlign: 'center',
        fontWeight: '600',
    },
    resize: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
    },
    title: {
        alignItems: 'center',
        textAlign: 'center',
        marginVertical: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    fixToText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});