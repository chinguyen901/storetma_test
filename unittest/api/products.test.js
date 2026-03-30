import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createReq, createRes } from '../helpers/mock-http.js';

const mockSql = vi.fn();
let getSqlImpl = mockSql;

vi.mock('../../pages/api/_db.js', () => ({
  getSql: () => getSqlImpl,
}));

import handler from '../../pages/api/products.js';

const sampleRow = {
  id: 'p1',
  name_vi: 'Ao',
  name_en: 'Shirt',
  price_cents: 2990,
  image: 'https://example.com/i.jpg',
  section: 'daily',
  category: 'fashion',
  badge: 'sale',
  created_at: '2025-01-01',
};

describe('pages/api/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSqlImpl = mockSql;
  });

  it('sets CORS headers on every response', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: {} });
    const res = createRes();
    await handler(req, res);
    expect(res.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(res.headers['Access-Control-Allow-Methods']).toBe('GET, OPTIONS');
  });

  it('responds 204 to OPTIONS', async () => {
    const req = createReq({ method: 'OPTIONS' });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('responds 405 to non-GET', async () => {
    const req = createReq({ method: 'POST' });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: 'Method not allowed' });
  });

  it('responds 500 when getSql returns null', async () => {
    getSqlImpl = null;
    const req = createReq();
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/DATABASE_URL/);
  });

  it('returns items, total, hasMore, nextOffset on success', async () => {
    mockSql.mockResolvedValueOnce([sampleRow]).mockResolvedValueOnce([{ total: 5 }]);
    const req = createReq({ query: { limit: '10', offset: '0' } });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0]).toMatchObject({
      id: 'p1',
      nameVi: 'Ao',
      nameEn: 'Shirt',
      price_cents: 2990,
      badge: 'sale',
    });
    expect(res.body.total).toBe(5);
    expect(res.body.hasMore).toBe(true);
    expect(res.body.nextOffset).toBe(1);
  });

  it('maps null badge to empty string', async () => {
    const row = { ...sampleRow, badge: null };
    mockSql.mockResolvedValueOnce([row]).mockResolvedValueOnce([{ total: 1 }]);
    const req = createReq();
    const res = createRes();
    await handler(req, res);
    expect(res.body.items[0].badge).toBe('');
  });

  it('uses section flash when query.section is flash', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { section: 'flash' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][0]).toBe('flash');
  });

  it('defaults invalid category to all', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { category: 'not-a-real-category' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][1]).toBe('all');
  });

  it('passes normalized search q lowercase', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { q: '  Hello  ' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][2]).toBe('hello');
  });

  it('clamps limit to 1..100', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { limit: '999' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][3]).toBe(100);
  });

  it('uses default limit 12 for flash when limit invalid', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { section: 'flash', limit: 'x' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][3]).toBe(12);
  });

  it('uses default limit 24 for daily when limit invalid', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { limit: 'x' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][3]).toBe(24);
  });

  it('normalizes negative offset to 0', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { offset: '-5' } });
    const res = createRes();
    await handler(req, res);
    expect(mockSql.mock.calls[0][1][4]).toBe(0);
  });

  it('injects ORDER BY for priceAsc', async () => {
    mockSql.mockResolvedValueOnce([]).mockResolvedValueOnce([{ total: 0 }]);
    const req = createReq({ query: { sort: 'priceAsc' } });
    const res = createRes();
    await handler(req, res);
    const sqlText = mockSql.mock.calls[0][0];
    expect(sqlText).toContain('price_cents ASC');
  });

  it('responds 500 when sql throws', async () => {
    mockSql.mockRejectedValueOnce(new Error('connection refused'));
    const req = createReq();
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('connection refused');
  });
});
