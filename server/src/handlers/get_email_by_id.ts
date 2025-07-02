
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type GetEmailByIdInput, type Email } from '../schema';
import { eq } from 'drizzle-orm';

export const getEmailById = async (input: GetEmailByIdInput): Promise<Email | null> => {
  try {
    const result = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.id, input.id))
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Failed to get email by ID:', error);
    throw error;
  }
};
