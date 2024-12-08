import { z } from "@hono/zod-openapi";

export const RegisterQrcodeSchema = z.object({
        user_id: z.string().openapi({
            example: '12345678-e29b-41d4-a716-123456789000'
        }),
        qrcode_content: z.string().openapi({
            example: 'https://naoido.com'
        }),
        qrcode_name: z.string().openapi({
            example: 'naoido.com'
        }),
        qrcode_id: z.string().openapi({
            example: '12345678-e29b-41d4-a716-123456789000'
        }),
    }
).openapi("RegisterQrcodeSchema")