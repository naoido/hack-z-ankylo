import axios from "axios";
import FormData from 'form-data';
import { FileUpload } from "graphql-upload-ts";
import { QrCode } from "../generated/graphql.js";

const BASE_URL = "http://qr:8080"

export const generate = async (content: string, qrcode_name: string, user_id: string) => {
    return (await axios.post<QrCode>(`${BASE_URL}/qrcode/generate`, { content, qrcode_name, user_id })).data
}

export const generateAnimate = async (file: Promise<FileUpload>, user_id: string, content: string): Promise<string | null> => {
    const { createReadStream, filename, mimetype, encoding } = await file;

    if (!['image/png', 'image/gif'].includes(mimetype)) {
        return "Unsupported this mimetype"
    }

    const stream = createReadStream();
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    const sizeLimit = 10 * 1024 * 1024; // 10MB

    try {
        for await (const chunk of stream) {
            const buf = chunk as Buffer;
            chunks.push(buf);
            totalBytes += buf.length;

            if (totalBytes > sizeLimit) {
                return 'ファイルサイズが10MBを超えています';
            }
        }
    } catch (err) {
        console.error('Error reading stream:', err);
        return 'Internal Server Error';
    }

    const fileBuffer = Buffer.concat(chunks);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", user_id);
    formData.append('file', fileBuffer, filename);

    try {
        const response = (await axios.post('http://animate-qr:8080/generate', formData, {
            headers: {
                ...formData.getHeaders()
            },
        })).data;

        return response["qrcode_id"];
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