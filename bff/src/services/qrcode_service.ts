import axios from "axios"
import { QrCode } from "../generated/graphql.js"

const BASE_URL = "http://qr:8080"

export const generate = async (content: string, qrcode_name: string, user_id: string) => {
    return (await axios.post<QrCode>(`${BASE_URL}/qrcode/generate`, { content, qrcode_name, user_id })).data
}

export const qrCodes = async (page: number, count: number, user_id: string) => {
    return (await axios.get<QrCode[]>(`${BASE_URL}/qrcode/list/user`, { params: { page, count, user_id } })).data
}

export const usersQrCodes = async (page: number, count: number, user_ids: string) => {
    return (await axios.get<QrCode[]>(`${BASE_URL}/qrcode/list/user`, { params: { page, count, user_ids } })).data
}