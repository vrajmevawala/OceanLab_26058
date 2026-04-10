import { initTRPC } from '@trpc/server';
import type { Context } from './context.js';

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    if (error.cause) {
      console.error('[tRPC Error Cause]:', error.cause);
    }
    return shape;
  },
});
