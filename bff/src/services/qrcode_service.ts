import axios from "axios";
import FormData from 'form-data';
import { FileUpload } from "graphql-upload-ts";
import { QrCode } from "../generated/graphql.js";

const BASE_URL = "http://qr:8080"

export const generate = async (content: string, qrcode_name: string, user_id: string) => {
    return (await axios.post<QrCode>(`${BASE_URL}/qrcode/generate`, { content, qrcode_name, user_id })).data
}

export const generateAnimate = async (file: Promise<FileUpload> | PromiseLike<{ createReadStream: any; filename: any; mimetype: any; encoding: any }> | { createReadStream: any; filename: any; mimetype: any; encoding: any }): Promise<string | null> => {
    const { createReadStream, filename, mimetype, encoding } = await file;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimetype)) {
        return "Unsupported this mimetype"
    }

    const stream = createReadStream();
    let totalBytes = 0;

    stream.on('data', (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > 10 * 1024 * 1024) {
            stream.destroy();
            throw new Error('ファイルサイズが10MBを超えています');
        }
    });

    const formData = new FormData();
    formData.append('file', stream);

    try {
        const response = await axios.post('http://animate-qr/upload', formData, {
            headers: {
                ...formData.getHeaders(),
              'apollo-require-preflight': 'true'
            },
        });

        return null;
    } catch (error) {
        return "Internal Server Error"
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