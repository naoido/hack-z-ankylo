import { z } from '@hono/zod-openapi';

export const QrCode = z.object({
    qrcode_id: z.string().openapi({
        example: "12345678-e29b-41d4-a716-123456789000"
    }),
    qrcode_name: z.string().openapi({
        example: "example.com"
    }),
    qrcode_content: z.string().openapi({
        example: "https://example.com"
    }),
    qrcode_url: z.string().openapi({
        example: "https://img.example.com/hoge.png"
    }),
    user_id: z.string().openapi({
        example: "12345678-e29b-41d4-a716-123456789000"
    })
}).openapi("QrCode");

export const QrCodeList = z.array(QrCode).openapi('QrCodeList');