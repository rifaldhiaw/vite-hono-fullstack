import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { TrpcContext } from ".";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  // TODO: implement session check
  // if (!ctx.session || !ctx.user) {
  //   throw new TRPCError({ code: "UNAUTHORIZED" });
  // }

  return next({
    ctx: {
      // TODO: implement session
      // infers the `session` and `user` as non-nullable
      //   session: { ...ctx.session },
      //   user: { ...ctx.user },
    },
  });
});
