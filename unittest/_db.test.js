import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { neon } from '@neondatabase/serverless';

vi.mock('@neondatabase/serverless', () => ({
  neon: vi.fn((url) => ({ _mockSql: true, url })),
}));

import { getSql } from '../pages/api/_db.js';

describe('pages/api/_db getSql', () => {
  const saved = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
  });

  afterEach(() => {
    process.env = { ...saved };
  });

  it('returns null when neither DATABASE_URL nor POSTGRES_URL is set', () => {
    expect(getSql()).toBeNull();
    expect(neon).not.toHaveBeenCalled();
  });

  it('calls neon with DATABASE_URL when set', () => {
    process.env.DATABASE_URL = 'postgresql://a';
    const client = getSql();
    expect(neon).toHaveBeenCalledTimes(1);
    expect(neon).toHaveBeenCalledWith('postgresql://a');
    expect(client).toEqual({ _mockSql: true, url: 'postgresql://a' });
  });

  it('prefers DATABASE_URL over POSTGRES_URL when both are set', () => {
    process.env.DATABASE_URL = 'postgresql://primary';
    process.env.POSTGRES_URL = 'postgresql://fallback';
    getSql();
    expect(neon).toHaveBeenCalledWith('postgresql://primary');
  });

  it('uses POSTGRES_URL when DATABASE_URL is missing', () => {
    process.env.POSTGRES_URL = 'postgresql://only';
    getSql();
    expect(neon).toHaveBeenCalledWith('postgresql://only');
  });
});
