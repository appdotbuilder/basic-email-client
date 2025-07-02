
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { type GetEmailsByRecipientInput } from '../schema';
import { getEmailsByRecipient } from '../handlers/get_emails_by_recipient';
import { eq } from 'drizzle-orm';

// Test input
const testInput: GetEmailsByRecipientInput = {
  recipient: 'john@example.com'
};

describe('getEmailsByRecipient', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return emails for a specific recipient', async () => {
    // Create test emails for different recipients
    await db.insert(emailsTable)
      .values([
        {
          sender: 'alice@example.com',
          recipient: 'john@example.com',
          subject: 'Hello John',
          body: 'This is a test email for John'
        },
        {
          sender: 'bob@example.com',
          recipient: 'john@example.com',
          subject: 'Meeting Tomorrow',
          body: 'Don\'t forget about our meeting'
        },
        {
          sender: 'charlie@example.com',
          recipient: 'jane@example.com',
          subject: 'Hello Jane',
          body: 'This email is for Jane, not John'
        }
      ])
      .execute();

    const result = await getEmailsByRecipient(testInput);

    // Should return only emails for john@example.com
    expect(result).toHaveLength(2);
    
    // Verify all returned emails are for the correct recipient
    result.forEach(email => {
      expect(email.recipient).toEqual('john@example.com');
      expect(email.id).toBeDefined();
      expect(email.sender).toBeDefined();
      expect(email.subject).toBeDefined();
      expect(email.body).toBeDefined();
      expect(email.sent_at).toBeInstanceOf(Date);
    });

    // Verify specific email content
    const subjects = result.map(email => email.subject);
    expect(subjects).toContain('Hello John');
    expect(subjects).toContain('Meeting Tomorrow');
  });

  it('should return empty array when no emails exist for recipient', async () => {
    // Create emails for other recipients
    await db.insert(emailsTable)
      .values({
        sender: 'alice@example.com',
        recipient: 'jane@example.com',
        subject: 'Hello Jane',
        body: 'This is for Jane only'
      })
      .execute();

    const result = await getEmailsByRecipient(testInput);

    expect(result).toHaveLength(0);
  });

  it('should return emails ordered by most recent first', async () => {
    // Create emails with specific timestamps
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

    // Insert emails in non-chronological order
    await db.insert(emailsTable)
      .values([
        {
          sender: 'alice@example.com',
          recipient: 'john@example.com',
          subject: 'Oldest Email',
          body: 'This was sent first',
          sent_at: twoHoursAgo
        },
        {
          sender: 'bob@example.com',
          recipient: 'john@example.com',
          subject: 'Newest Email',
          body: 'This was sent last',
          sent_at: now
        },
        {
          sender: 'charlie@example.com',
          recipient: 'john@example.com',
          subject: 'Middle Email', 
          body: 'This was sent in between',
          sent_at: oneHourAgo
        }
      ])
      .execute();

    const result = await getEmailsByRecipient(testInput);

    expect(result).toHaveLength(3);
    
    // Verify emails are ordered by most recent first
    expect(result[0].subject).toEqual('Newest Email');
    expect(result[1].subject).toEqual('Middle Email');
    expect(result[2].subject).toEqual('Oldest Email');
    
    // Verify timestamps are in descending order
    expect(result[0].sent_at.getTime()).toBeGreaterThan(result[1].sent_at.getTime());
    expect(result[1].sent_at.getTime()).toBeGreaterThan(result[2].sent_at.getTime());
  });

  it('should handle recipient with special characters', async () => {
    const specialRecipient = 'user+test@sub-domain.example.com';
    
    await db.insert(emailsTable)
      .values({
        sender: 'alice@example.com',
        recipient: specialRecipient,
        subject: 'Special Email',
        body: 'Email with special character recipient'
      })
      .execute();

    const result = await getEmailsByRecipient({ recipient: specialRecipient });

    expect(result).toHaveLength(1);
    expect(result[0].recipient).toEqual(specialRecipient);
    expect(result[0].subject).toEqual('Special Email');
  });
});
