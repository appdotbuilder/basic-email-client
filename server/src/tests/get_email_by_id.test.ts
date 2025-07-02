
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type GetEmailByIdInput } from '../schema';
import { getEmailById } from '../handlers/get_email_by_id';

describe('getEmailById', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return email when found', async () => {
    // Create test email
    const result = await db.insert(emailsTable)
      .values({
        sender: 'test@example.com',
        recipient: 'user@example.com',
        subject: 'Test Subject',
        body: 'Test email body'
      })
      .returning()
      .execute();

    const insertedEmail = result[0];

    const input: GetEmailByIdInput = {
      id: insertedEmail.id
    };

    const email = await getEmailById(input);

    expect(email).not.toBeNull();
    expect(email!.id).toEqual(insertedEmail.id);
    expect(email!.sender).toEqual('test@example.com');
    expect(email!.recipient).toEqual('user@example.com');
    expect(email!.subject).toEqual('Test Subject');
    expect(email!.body).toEqual('Test email body');
    expect(email!.sent_at).toBeInstanceOf(Date);
  });

  it('should return null when email not found', async () => {
    const input: GetEmailByIdInput = {
      id: 999
    };

    const email = await getEmailById(input);

    expect(email).toBeNull();
  });

  it('should return correct email when multiple emails exist', async () => {
    // Create multiple test emails
    const emails = await db.insert(emailsTable)
      .values([
        {
          sender: 'sender1@example.com',
          recipient: 'user1@example.com',
          subject: 'Subject 1',
          body: 'Body 1'
        },
        {
          sender: 'sender2@example.com',
          recipient: 'user2@example.com',
          subject: 'Subject 2',
          body: 'Body 2'
        }
      ])
      .returning()
      .execute();

    const input: GetEmailByIdInput = {
      id: emails[1].id
    };

    const email = await getEmailById(input);

    expect(email).not.toBeNull();
    expect(email!.id).toEqual(emails[1].id);
    expect(email!.sender).toEqual('sender2@example.com');
    expect(email!.recipient).toEqual('user2@example.com');
    expect(email!.subject).toEqual('Subject 2');
    expect(email!.body).toEqual('Body 2');
  });
});
