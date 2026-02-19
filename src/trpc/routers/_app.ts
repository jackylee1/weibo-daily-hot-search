import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
    //hello: baseProcedure
    //.input(
    // z.object({
    // text: z.string(),
    //}),
    //)
    getUsers: protectedProcedure.query(({ ctx }) => {

        return prisma.user.findMany({
            where: {
                id: ctx.auth.user.id,
            },

        });
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
