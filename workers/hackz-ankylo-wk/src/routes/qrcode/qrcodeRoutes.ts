import { createRoute } from "@hono/zod-openapi";
import { ErrorResponse } from "../../models/error";
import { SuccessResponse } from "../../models/success";
import { RegisterQrcodeSchema } from "../../schemas/qrcodeSchemas";

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
