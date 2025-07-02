
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { 
  createEmailInputSchema, 
  getEmailsByRecipientInputSchema, 
  getEmailByIdInputSchema 
} from './schema';
import { createEmail } from './handlers/create_email';
import { getEmailsByRecipient } from './handlers/get_emails_by_recipient';
import { getEmailById } from './handlers/get_email_by_id';
import { getAllEmails } from './handlers/get_all_emails';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new email (send email)
  createEmail: publicProcedure
    .input(createEmailInputSchema)
    .mutation(({ input }) => createEmail(input)),
  
  // Get emails for a specific recipient (inbox)
  getEmailsByRecipient: publicProcedure
    .input(getEmailsByRecipientInputSchema)
    .query(({ input }) => getEmailsByRecipient(input)),
  
  // Get a specific email by ID (detailed view)
  getEmailById: publicProcedure
    .input(getEmailByIdInputSchema)
    .query(({ input }) => getEmailById(input)),
  
  // Get all emails (general listing)
  getAllEmails: publicProcedure
    .query(() => getAllEmails()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
