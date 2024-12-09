import * as React from "react";
import { Slot } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Header, Icon } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default () => {

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <Header
                    backgroundImageStyle={{}}
                    backgroundColor={'#000000'}
                    barStyle="default"
                    containerStyle={styles.header}
                    leftComponent={
                        <Text style={{ color: 'white' }}>Welcome</Text>
                    }
                    leftContainerStyle={{ width: 100 }}
                    placement="center"
                    rightComponent={
                        <Icon
                            name="account"
                            type="material-community"
                            color="white"
                        />
                    }
                    rightContainerStyle={{}}
                    statusBarProps={{}}
                />

                <View style={styles.content}>
                    <Slot />
                </View>

                <View style={styles.footer}>
                    <Text>にゃーん</Text>
                </View>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        width: '100%',
    },
    content: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    footer: {
        backgroundColor: '#000000',
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
