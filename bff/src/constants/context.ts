import { IncomingHttpHeaders } from "http";

export interface Context {
    headers: IncomingHttpHeaders;
}