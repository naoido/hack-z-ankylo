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
        qrcode_url: z.string().openapi({
            example: 'https://img.example.com/hoge.png'
        }),
        qrcode_id: z.string().openapi({
            example: '12345678-e29b-41d4-a716-123456789000'
        }),
    }
).openapi("RegisterQrcodeSchema");

export const GetQrCodesSchema = z.object({
    page: z.preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().default(0)
    ).openapi({
        example: 1
    }).describe("ページ番号"),
    count: z.preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().default(10)
    ).openapi({
        example: 10
    }).describe("1ページあたりの取得件数"),
    user_id: z.string().openapi({
        example: "12345678-e29b-41d4-a716-123456789000"
    })
}).openapi("GetQrCodesSchema");

export const GetUsersQrCodesSchema = z.object({
    page: z.preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().default(0)
    ).openapi({
        example: 1
    }).describe("ページ番号"),
    count: z.preprocess(
        (val) => (typeof val === "string" ? parseInt(val, 10) : val),
        z.number().int().default(10)
    ).openapi({
        example: 10
    }).describe("1ページあたりの取得件数"),
    user_ids: z.preprocess(
        (val) => (typeof val === "string" ? val.split(",") : []),
        z.array(z.string()),
    ).openapi({
        example: "12345678-e29b-41d4-a716-123456789000,12345678-e29b-41d4-a716-123456789001"
    }).describe("カンマ区切りのユーザーIDリスト")
}).openapi("GetUsersQrCodesSchema");