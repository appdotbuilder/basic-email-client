
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type CreateEmailInput } from '../schema';
import { createEmail } from '../handlers/create_email';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateEmailInput = {
  sender: 'test@example.com',
  recipient: 'recipient@example.com',
  subject: 'Test Email Subject',
  body: 'This is a test email body'
};

describe('createEmail', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an email', async () => {
    const result = await createEmail(testInput);

    // Basic field validation
    expect(result.sender).toEqual('test@example.com');
    expect(result.recipient).toEqual('recipient@example.com');
    expect(result.subject).toEqual('Test Email Subject');
    expect(result.body).toEqual('This is a test email body');
    expect(result.id).toBeDefined();
    expect(result.sent_at).toBeInstanceOf(Date);
  });

  it('should save email to database', async () => {
    const result = await createEmail(testInput);

    // Query using proper drizzle syntax
    const emails = await db.select()
      .from(emailsTable)
      .where(eq(emailsTable.id, result.id))
      .execute();

    expect(emails).toHaveLength(1);
    expect(emails[0].sender).toEqual('test@example.com');
    expect(emails[0].recipient).toEqual('recipient@example.com');
    expect(emails[0].subject).toEqual('Test Email Subject');
    expect(emails[0].body).toEqual('This is a test email body');
    expect(emails[0].sent_at).toBeInstanceOf(Date);
  });

  it('should auto-generate id and sent_at timestamp', async () => {
    const result = await createEmail(testInput);

    expect(typeof result.id).toBe('number');
    expect(result.id).toBeGreaterThan(0);
    expect(result.sent_at).toBeInstanceOf(Date);
    
    // Verify timestamp is recent (within last 5 seconds)
    const now = new Date();
    const timeDiff = now.getTime() - result.sent_at.getTime();
    expect(timeDiff).toBeLessThan(5000);
  });

  it('should handle empty body', async () => {
    const inputWithEmptyBody: CreateEmailInput = {
      sender: 'sender@example.com',
      recipient: 'recipient@example.com',
      subject: 'No Body Email',
      body: ''
    };

    const result = await createEmail(inputWithEmptyBody);

    expect(result.body).toEqual('');
    expect(result.sender).toEqual('sender@example.com');
    expect(result.recipient).toEqual('recipient@example.com');
    expect(result.subject).toEqual('No Body Email');
  });
});
