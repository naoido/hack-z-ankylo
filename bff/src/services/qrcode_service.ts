import axios from "axios";
import { QrCode } from "../generated/graphql.js";

const BASE_URL = "http://qr:8080"

export const generate = async (content: string, qrcode_name: string, user_id: string) => {
    return (await axios.post<QrCode>(`${BASE_URL}/qrcode/generate`, { content, qrcode_name, user_id })).data
}

export const generateAnimate = async (image: string, user_id: string, content: string, qrcode_name: string, qrcode_id: string): Promise<string | QrCode> => {
    try {
        const qrcode_url = (await axios.post('http://animate-qr:8080/generate', {
            image, user_id, qrcode_id, content
        })).data["qrcode_url"];

        let response = (await axios.post<QrCode>("http://qr:8080/qrcode/register", { content, user_id, qrcode_id, qrcode_name, qrcode_url })).data;
        response.qrcode_url = qrcode_url;

        return response;
    } catch (error) {
        console.log(error);
        return "Internal Server Error";
    }
}

export const qrCodes = async (page: number, count: number, user_id: string): Promise<QrCode[]> => {
    try {
        const response = await axios.get<QrCode[]>(`${BASE_URL}/qrcode/list/user`, {
            params: { page, count, user_id },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        }
        throw error;
    }
};

export const usersQrCodes = async (page: number, count: number, user_ids: string) => {
    try {
        const response = await axios.get<QrCode[]>(`${BASE_URL}/qrcode/list/users`, {
            params: { page, count, user_ids },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return [];
        }
        throw error;
    }
}