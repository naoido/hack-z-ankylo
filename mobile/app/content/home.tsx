import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/Feather";
import { sessionAtom, userAtom } from "../index";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Home() {
    const router = useRouter();
    const [session] = useAtom(sessionAtom);
    const [User] = useAtom(userAtom);
    console.log(session.access_token);

    const features = [
        { name: 'QR 神経衰弱', icon: 'grid', route: './matching' },
        { name: 'スライドパズル', icon: 'move', route: './slide'},
        { name: 'QR 解読', icon: 'search', route: './qrdecoder' },
        { name: 'QR コード登録', icon: 'plus-square', route: './qrcoderegister' },
        { name: 'コレクション', icon: 'layout' , route: './collection'},
        { name: 'ログアウト', icon: 'logout', route: './logout'}
    ];

    const opacity = useSharedValue(0);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
        scale.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.exp) });
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.mainContent}>
                    <View style={styles.grid}>
                        {features.map((item, index) => (
                            <AnimatedTouchableOpacity
                                key={index}
                                style={[styles.card, animatedStyle]}
                                onPress={() => router.push(item.route)}
                            >
                                <Icon name={item.icon} size={32} color="#84cc16" />
                                <Text style={styles.cardText}>{item.name}</Text>
                            </AnimatedTouchableOpacity>
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
});

