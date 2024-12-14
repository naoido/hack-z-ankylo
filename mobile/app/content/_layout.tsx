import styled from '@emotion/native';
import { Slot, useRouter } from "expo-router";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";


export default () => {
    const router = useRouter();
    return (
        <SafeAreaProvider style={{ flex: 1 }}>
            <Container>
                <Header>
                    <HeaderText>Welcome to QR World </HeaderText>
                </Header>

                <Content>
                    <Slot />
                </Content>
                <Footer>
                    <Row>
                        <IconButton onPress={() => router.push("/content/home")}>
                            <Icon name="home" size={34} color="#84cc16" />
                        </IconButton>
                        <IconButton onPress={() => router.push("/qrgame/matching")}>
                            <Icon name="grid" size={34} color="#84cc16" />
                        </IconButton>
                        <IconButton onPress={() => router.push("/content/slide")}>
                            <Icon name="move" size={34} color="#84cc16" />
                        </IconButton>
                        <IconButton onPress={() => router.push("/content/qrdecoder")}>
                            <Icon name="search" size={34} color="#84cc16" />
                        </IconButton>
                        <IconButton onPress={() => router.push("/content/qrcoderegister")}>
                            <Icon name="plus-square" size={34} color="#84cc16" />
                        </IconButton>
                        <IconButton onPress={() => router.push("/content/collection")}>
                            <Icon name="layout" size={34    } color="#84cc16" />
                        </IconButton>
                    </Row>
                </Footer>
            </Container>
        </SafeAreaProvider>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: white;
`;

const Header = styled.View`
    background-color: black;
    padding: 16px;
    align-items: center;
`;

const HeaderText = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: white;
`;

const Content = styled.View`
    flex: 1;
    background-color: white;
`;

const Footer = styled.View`
    background-color: black;
    padding: 16px;
    align-items: center;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: space-around;
`;

const IconButton = styled.TouchableOpacity`
    margin-horizontal: 15px;
`;