
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type GetEmailsByRecipientInput, type Email } from '../schema';
import { eq, desc } from 'drizzle-orm';

export const getEmailsByRecipient = async (input: GetEmailsByRecipientInput): Promise<Email[]> => {
  try {
    // Query emails for the specified recipient, ordered by most recent first
    const results = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.recipient, input.recipient))
      .orderBy(desc(emailsTable.sent_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get emails by recipient:', error);
    throw error;
  }
};
