import { RouteHandler, z } from "@hono/zod-openapi";
import { Bindings } from "../binding";
import { ErrorResponse } from "../models/error";
import { QrCodeList } from "../models/qrcode";
import { SuccessResponse } from "../models/success";
import { getQrcodesRoute, getUsersQrcodesRoute, registerQrcodeRoute } from "../routes/qrcode/qrcodeRoutes";
import { GetQrCodesSchema, GetUsersQrCodesSchema, RegisterQrcodeSchema } from "../schemas/qrcodeSchemas";

type RegisterQrcodeRequest = z.infer<typeof RegisterQrcodeSchema>;
type GetQrCodesRequest = z.infer<typeof GetQrCodesSchema>;
type GetUsersQrCodesRequest = z.infer<typeof GetUsersQrCodesSchema>;

export const registerQrcodeHandler: RouteHandler<typeof registerQrcodeRoute, { Bindings: Bindings }> = async (c) => {
    const req = await c.req.json<RegisterQrcodeRequest>();

    try {
        const db = c.env.DB;
        await db.prepare("INSERT INTO qrcodes (user_id, qrcode_content, qrcode_url, qrcode_name, id) VALUES (?, ?, ?, ?, ?)")
            .bind(req.user_id, req.qrcode_content, req.qrcode_url, req.qrcode_name, req.qrcode_id).run();

        return c.json(SuccessResponse.parse({
            message: "success"
        }), 200);
    } catch (error) {
        return c.json(ErrorResponse.parse({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            stackTrace: error instanceof Error ? error.stack : undefined
        }), 500);
    }
};

export const getQrCodesHandler: RouteHandler<typeof getQrcodesRoute, {Bindings: Bindings}> = async (c) => {
    const req: GetQrCodesRequest = GetQrCodesSchema.parse(c.req.query());

    try {
        const db = c.env.DB;
        const data = await getQrcodes(db, req);

        return c.json(data, 200);
    } catch (error) {
        return c.json(ErrorResponse.parse({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            stackTrace: error instanceof Error ? error.stack : undefined
        }), 500);
    }
};

export const getUsersQrCodesHandler: RouteHandler<typeof getUsersQrcodesRoute, {Bindings: Bindings}> = async (c) => {
    const req: GetUsersQrCodesRequest = GetUsersQrCodesSchema.parse(c.req.query());

    try {
        const db = c.env.DB;
        const result = await Promise.all(
            req.user_ids.map((id) =>
                getQrcodes(db, <GetQrCodesRequest>{
                    user_id: id,
                    page: req.page,
                    count: req.count,
                })
            )
        );
        const data = result.flat();
      
        return c.json(data, 200);
    } catch (error) {
        return c.json(ErrorResponse.parse({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            stackTrace: error instanceof Error ? error.stack : undefined
        }), 500);
    }
};


const getQrcodes = async (db: D1Database, req: GetQrCodesRequest): Promise<z.infer<typeof QrCodeList>> => {
    const results = (await db.prepare("SELECT user_id, qrcode_name, qrcode_url, qrcode_content, id as qrcode_id FROM qrcodes WHERE user_id = ? LIMIT ? OFFSET ?")
        .bind(req.user_id, req.count, (req.page - 1) * req.count).all()).results;

    const data = QrCodeList.parse(results);
    return data;
}