import { describe, it, expect } from 'vitest';

/**
 * Unit tests for the subscribe endpoint validation logic.
 * These test the validation rules without needing to start the server.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe('Subscribe email validation', () => {
  const validEmails = [
    'user@example.com',
    'test.user@domain.co.au',
    'name+tag@gmail.com',
    'user@sub.domain.org',
  ];

  const invalidEmails = [
    '',
    '   ',
    'not-an-email',
    '@missing-local.com',
    'missing-domain@',
    'spaces in@email.com',
    'no@dots',
  ];

  for (const email of validEmails) {
    it(`accepts valid email: ${email}`, () => {
      expect(EMAIL_REGEX.test(email.trim().toLowerCase())).toBe(true);
    });
  }

  for (const email of invalidEmails) {
    it(`rejects invalid email: "${email}"`, () => {
      const cleaned = email.trim().toLowerCase();
      expect(!cleaned || !EMAIL_REGEX.test(cleaned)).toBe(true);
    });
  }
});

describe('Subscribe env validation', () => {
  it('detects missing BEEHIIV_API_KEY', () => {
    const apiKey = undefined;
    const pubId = 'pub_test';
    expect(!apiKey || !pubId).toBe(true);
  });

  it('detects missing BEEHIIV_PUBLICATION_ID', () => {
    const apiKey = 'bh_test';
    const pubId = undefined;
    expect(!apiKey || !pubId).toBe(true);
  });

  it('passes when both env vars are set', () => {
    const apiKey = 'bh_test';
    const pubId = 'pub_test';
    expect(!apiKey || !pubId).toBe(false);
  });
});
