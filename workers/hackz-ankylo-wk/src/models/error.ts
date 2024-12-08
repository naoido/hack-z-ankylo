import { z } from '@hono/zod-openapi';

export const ErrorResponse = z.object({
    message: z.string(),
    stackTrace: z.string().optional(),
  })
  .openapi('ErrorResponse');