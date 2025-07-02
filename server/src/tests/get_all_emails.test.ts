
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { emailsTable } from '../db/schema';
import { getAllEmails } from '../handlers/get_all_emails';

describe('getAllEmails', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no emails exist', async () => {
    const result = await getAllEmails();
    expect(result).toEqual([]);
  });

  it('should return all emails from database', async () => {
    // Create test emails
    await db.insert(emailsTable)
      .values([
        {
          sender: 'alice@example.com',
          recipient: 'bob@example.com',
          subject: 'Hello Bob',
          body: 'How are you doing?'
        },
        {
          sender: 'bob@example.com',
          recipient: 'alice@example.com',
          subject: 'Re: Hello Bob',
          body: 'I am doing well, thanks!'
        },
        {
          sender: 'charlie@example.com',
          recipient: 'alice@example.com',
          subject: 'Meeting tomorrow',
          body: 'Are we still on for the meeting?'
        }
      ])
      .execute();

    const result = await getAllEmails();

    expect(result).toHaveLength(3);
    
    // Verify all emails are returned
    const subjects = result.map(email => email.subject);
    expect(subjects).toContain('Hello Bob');
    expect(subjects).toContain('Re: Hello Bob');
    expect(subjects).toContain('Meeting tomorrow');

    // Verify email structure
    result.forEach(email => {
      expect(email.id).toBeDefined();
      expect(typeof email.sender).toBe('string');
      expect(typeof email.recipient).toBe('string');
      expect(typeof email.subject).toBe('string');
      expect(typeof email.body).toBe('string');
      expect(email.sent_at).toBeInstanceOf(Date);
    });
  });

  it('should return emails in order they were inserted', async () => {
    // Create test emails with distinct subjects for ordering verification
    await db.insert(emailsTable)
      .values([
        {
          sender: 'first@example.com',
          recipient: 'test@example.com',
          subject: 'First Email',
          body: 'This is the first email'
        },
        {
          sender: 'second@example.com',
          recipient: 'test@example.com',
          subject: 'Second Email',
          body: 'This is the second email'
        }
      ])
      .execute();

    const result = await getAllEmails();

    expect(result).toHaveLength(2);
    expect(result[0].subject).toEqual('First Email');
    expect(result[1].subject).toEqual('Second Email');
    
    // Verify timestamps are in chronological order (first email sent earlier)
    expect(result[0].sent_at <= result[1].sent_at).toBe(true);
  });
});
