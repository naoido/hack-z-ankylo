import { z } from '@hono/zod-openapi';

export const SuccessResponse = z.object({
    message: z.string(),
  })
  .openapi('SuccessResponse');