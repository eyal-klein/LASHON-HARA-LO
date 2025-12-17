import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { commitmentsRouter } from "./routers/commitments";
import { contactRouter } from "./routers/contact";
import { partnershipsRouter } from "./routers/partnerships";
import { subscribersRouter } from "./routers/subscribers";
import { galleryRouter } from "./routers/gallery";
import { activitiesRouter } from "./routers/activities";
import { chofetzChaimRouter } from "./routers/chofetzChaim";
import { donationsRouter } from "./routers/donations";
import { productsRouter } from "./routers/products";
import { ordersRouter } from "./routers/orders";
import { chatbotRouter } from "./routers/chatbot";
import { contentRouter } from "./routers/content";

export const appRouter = router({
  // System router (notifications, etc.)
  system: systemRouter,
  
  // Authentication
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Feature routers
  commitments: commitmentsRouter,
  contact: contactRouter,
  partnerships: partnershipsRouter,
  subscribers: subscribersRouter,
  gallery: galleryRouter,
  activities: activitiesRouter,
  chofetzChaim: chofetzChaimRouter,
  donations: donationsRouter,
  products: productsRouter,
  orders: ordersRouter,
  chatbot: chatbotRouter,
  content: contentRouter,
});

export type AppRouter = typeof appRouter;
