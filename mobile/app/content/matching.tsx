import { ApolloProvider, useMutation } from "@apollo/client";
import { router } from "expo-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { accessTokenAtom, userIdAtom } from "../index";
import { setAlert } from "../lib/alert";
import { client } from "../lib/graphql/client";
import { getQRcodes } from "../lib/graphql/query";
import Loading from "../utils/loading";

const ControllerView = () => {
    const [accessToken] = useAtom(accessTokenAtom);
    const [loading, setLoading] = useState(false);
    const [userId] = useAtom(userIdAtom);
    const [getQR] = useMutation(getQRcodes);

    useEffect(() => {
        const fetchQRcodes = async () => {
            setLoading(true);
            try {
                const { data } = await getQR({
                    variables: { page: 1, count: 4, userId: userId },
                    context: { headers: { authorization: `Bearer ${accessToken}` } }
                });

                const qrcodes = data.getQrCodes.qrcodes;
                if (!(qrcodes && qrcodes.length >= 4)) {
                    setAlert(
                        `必要なQRコードの数がありません\n(必要な個数: ${qrcodes.length || 0}/4)`,
                        Platform.OS
                    );
                    router.push("/content/home");
                    return;
                }

                console.log("QR Codes fetched successfully:", data);
                router.push("/qrgame/matching");
            } catch (error) {
                console.error("Error fetching QR codes:", error);
                setAlert("QRコードの取得中にエラーが発生しました", Platform.OS);
                router.push("/content/home");
            } finally {
                setLoading(false);
            }
        };
        fetchQRcodes();
    }, [accessToken, userId, getQR, router]);

    return loading ? <Loading /> : <View />
}

export default () => {
    return (
        <ApolloProvider client={client}>
            <ControllerView />
        </ApolloProvider>
    )
}