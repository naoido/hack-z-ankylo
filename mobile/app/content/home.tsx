import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { sessionAtom, userAtom } from "../index";
import { useAtom } from 'jotai';

export default function Home() {
    const router = useRouter();
    const [session] = useAtom(sessionAtom);
    const [User] = useAtom(userAtom)
    console.log(User);

    return (
        <SafeAreaProvider>
            <View>
                <Button
                    buttonStyle={{ width: 150 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: "#00F"
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={<Icon name="home" size={15} color="#0FF" />}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => router.push('/qrgame/matching')}
                    title="QRコード神経衰弱"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                />
                <Button
                    buttonStyle={{ width: 150 }}
                    containerStyle={{ margin: 5 }}
                    disabledStyle={{
                        borderWidth: 2,
                        borderColor: "#00F"
                    }}
                    disabledTitleStyle={{ color: "#00F" }}
                    linearGradientProps={null}
                    icon={<Icon name="image" size={15} color="#0FF" />}
                    loadingProps={{ animating: true }}
                    loadingStyle={{}}
                    onPress={() => router.push('/content/slide')}
                    title="スライド"
                    titleProps={{}}
                    titleStyle={{ marginHorizontal: 5 }}
                />
            </View>
            <Text>
                こんにちは、{ User ? User.username : 'guest' }！
                あなたのユーザーidは{session?.user.id}です。
            </Text>
        </SafeAreaProvider>
    );
}