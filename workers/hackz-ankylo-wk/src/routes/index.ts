import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../binding";
import { qrcodeApi } from "./qrcode";

export const api = new OpenAPIHono<{Bindings: Bindings}>();

api.use("/api/*", async (c, next) => {
    const requestJwt = c.req.header("Authorization");
    if (requestJwt != `Bearer ${c.env.API_KEY}`) {
        return c.json({ message: 'Unauthorized: Invalid token' }, 401);
    }
    await next();
  }
);

api.basePath("/api")
    .route('/qrcode', qrcodeApi)
    // .doc('/specification', {
    //     openapi: '3.0.0',
    //     info: {
    //         title: 'API',
    //         version: '1.0.0',
    //     },
    // }).get('/doc',
    //     swaggerUI({
    //         url: '/api/specification',
    //     })
    // );