import { RouteHandler, z } from "@hono/zod-openapi";
import { Bindings } from "../binding";
import { ErrorResponse } from "../models/error";
import { SuccessResponse } from "../models/success";
import { registerQrcodeRoute } from "../routes/qrcode/qrcodeRoutes";
import { RegisterQrcodeSchema } from "../schemas/qrcodeSchemas";

type RegisterQrcodeRequest = z.infer<typeof RegisterQrcodeSchema>

export const registerQrcodeHandler: RouteHandler<typeof registerQrcodeRoute, { Bindings: Bindings }> = async (c) => {
    const req = await c.req.json<RegisterQrcodeRequest>();

    try {
        const db = c.env.DB;
        await db.prepare("INSERT INTO qrcodes (user_id, qrcode_content, qrcode_name, id) VALUES (?, ?, ?, ?)")
            .bind(req.user_id, req.qrcode_content, req.qrcode_name, req.qrcode_id).run();

        return c.json(SuccessResponse.parse({
            message: "success"
        }), 200);
    } catch (error) {
        return c.json(ErrorResponse.parse({
            message: error instanceof Error ? error.message : "An unexpected error occurred",
            stackTrace: error instanceof Error ? error.stack : undefined
        }), 500);
    }
}

function VALUES(): any {
    throw new Error("Function not implemented.");
}
