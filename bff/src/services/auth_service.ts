import axios from "axios";
import { JwtPayload } from "../entities/user_response.js";

const BASE_URL = "http://auth:8080"

export const auth = async (req) => {
    if (!req?.headers?.authorization) return null;
    const response = await axios.post<JwtPayload>(`${BASE_URL}/token/validate`, {}, {
        headers: {
            "Authorization": `Bearer ${req.headers.authorization}`
        }
    });

    if (response.status != 200) {
        return null;
    }
    return response.data;
}