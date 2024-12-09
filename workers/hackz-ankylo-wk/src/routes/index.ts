import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { qrcodeApi } from "./qrcode";

export const api = new OpenAPIHono();

api
    .basePath("/api")
    .route('/qrcode', qrcodeApi)
    .doc('/specification', {
        openapi: '3.0.0',
        info: {
            title: 'API',
            version: '1.0.0',
        },
    }).get('/doc',
        swaggerUI({
            url: '/api/specification',
        })
    );