
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type Email } from '../schema';

export const getAllEmails = async (): Promise<Email[]> => {
  try {
    const results = await db.select()
      .from(emailsTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get all emails:', error);
    throw error;
  }
};
