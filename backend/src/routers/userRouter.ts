import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .query(async (ctx) => {
      return {
        id: ctx.input.id,
        name: ctx.input.name,
      } as const;
    }),
});
