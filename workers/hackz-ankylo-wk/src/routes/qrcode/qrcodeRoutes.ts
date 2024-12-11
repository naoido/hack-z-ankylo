import { createRoute } from "@hono/zod-openapi";
import { ErrorResponse } from "../../models/error";
import { QrCodeList } from "../../models/qrcode";
import { SuccessResponse } from "../../models/success";
import { GetQrCodesSchema, GetUsersQrCodesSchema, RegisterQrcodeSchema } from "../../schemas/qrcodeSchemas";

export const registerQrcodeRoute = createRoute({
    path: '/register',
    method: 'post',
    description: 'R2にQRCodeのデータを保存します',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: RegisterQrcodeSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "OK",
            content: {
                'application/json': {
                    schema: SuccessResponse
                }
            }
        },
        500: {
            description: "Internal Server Error",
            content: {
                'application/json': {
                    schema: ErrorResponse
                }
            }
        }
    }
});

export const getQrcodesRoute = createRoute({
    path: '/list/user',
    method: 'get',
    description: 'R2からQRCodeIDリストを取得します。',
    request: {
        query: GetQrCodesSchema
    },
    responses: {
        200: {
            description: "OK",
            content: {
                'application/json': {
                    schema: QrCodeList
                }
            }
        },
        500: {
            description: "Internal Server Error",
            content: {
                'application/json': {
                    schema: ErrorResponse
                }
            }
        }
    }
});

export const getUsersQrcodesRoute = createRoute({
    path: '/list/users',
    method: 'get',
    description: 'R2から複数ユーザーのQRCodeIDリストを取得します。',
    request: {
        query: GetUsersQrCodesSchema
    },
    responses: {
        200: {
            description: "OK",
            content: {
                'application/json': {
                    schema: QrCodeList
                }
            }
        },
        500: {
            description: "Internal Server Error",
            content: {
                'application/json': {
                    schema: ErrorResponse
                }
            }
        }
    }
});