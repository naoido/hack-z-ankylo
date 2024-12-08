import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../binding";
import { registerQrcodeHandler } from "../../handler/qrcodeHandler";
import { registerQrcodeRoute } from "./qrcodeRoutes";

export const qrcodeApi = new OpenAPIHono<{ Bindings: Bindings }>();

qrcodeApi.openapi(registerQrcodeRoute, registerQrcodeHandler)