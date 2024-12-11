import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "../../binding";
import { getQrCodesHandler, getUsersQrCodesHandler, registerQrcodeHandler } from "../../handler/qrcodeHandler";
import { getQrcodesRoute, getUsersQrcodesRoute, registerQrcodeRoute } from "./qrcodeRoutes";

export const qrcodeApi = new OpenAPIHono<{ Bindings: Bindings }>();

qrcodeApi.openapi(registerQrcodeRoute, registerQrcodeHandler);
qrcodeApi.openapi(getQrcodesRoute, getQrCodesHandler);
qrcodeApi.openapi(getUsersQrcodesRoute, getUsersQrCodesHandler);