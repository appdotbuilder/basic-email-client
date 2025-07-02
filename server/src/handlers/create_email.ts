
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type CreateEmailInput, type Email } from '../schema';

export const createEmail = async (input: CreateEmailInput): Promise<Email> => {
  try {
    // Insert email record
    const result = await db.insert(emailsTable)
      .values({
        sender: input.sender,
        recipient: input.recipient,
        subject: input.subject,
        body: input.body
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Email creation failed:', error);
    throw error;
  }
};
