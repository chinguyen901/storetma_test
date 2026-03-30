import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createReq, createRes } from '../helpers/mock-http.js';

const mockSql = vi.fn();
let getSqlImpl = mockSql;

vi.mock('../../pages/api/_db.js', () => ({
  getSql: () => getSqlImpl,
}));

import handler from '../../pages/api/create-checkout.js';

const validStripeKey = 'sk_test_1234567890';

function stubFetchSuccess(url = 'https://checkout.stripe.com/c/pay/cs_test_xxx') {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ url }),
  });
}

describe('pages/api/create-checkout', () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    getSqlImpl = mockSql;
    process.env.STRIPE_SECRET_KEY = validStripeKey;
    mockSql.mockResolvedValue([]);
    stubFetchSuccess();
  });

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('sets CORS for POST, OPTIONS', async () => {
    const req = createReq({ method: 'OPTIONS' });
    const res = createRes();
    await handler(req, res);
    expect(res.headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
  });

  it('responds 204 to OPTIONS', async () => {
    const req = createReq({ method: 'OPTIONS' });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(204);
  });

  it('responds 405 to non-POST', async () => {
    const req = createReq({ method: 'GET' });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
    expect(res.body).toEqual({ error: 'Method not allowed' });
  });

  it('responds 500 when STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p1', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toMatch(/Stripe/i);
  });

  it('responds 500 when STRIPE_SECRET_KEY does not start with sk_', async () => {
    process.env.STRIPE_SECRET_KEY = 'pk_live_wrong';
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p1', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
  });

  it('responds 400 when items is empty', async () => {
    const req = createReq({ method: 'POST', body: { items: [] } });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Gio hang|Giỏ hàng/);
  });

  it('responds 400 when no line resolves (unknown ids)', async () => {
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'unknown_id', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('builds session from seeded catalog id p1', async () => {
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p1', qty: 2, name: 'Custom name' }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.url).toContain('checkout.stripe.com');
    expect(global.fetch).toHaveBeenCalled();
    const [, init] = global.fetch.mock.calls[0];
    expect(init.body).toContain('line_items%5B0%5D');
    expect(init.body).toContain('2990');
    expect(init.headers.Authorization).toBe(`Bearer ${validStripeKey}`);
  });

  it('prefers DB price over seed when product exists in DB', async () => {
    mockSql.mockResolvedValue([{ id: 'p1', name_vi: 'DB Vi', name_en: 'DB En', price_cents: 12345 }]);
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p1', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const [, init] = global.fetch.mock.calls[0];
    expect(init.body).toContain('12345');
    expect(init.body).toContain('DB+En');
  });

  it('resolves custom demo id with unit_amount_cents', async () => {
    const req = createReq({
      method: 'POST',
      body: {
        items: [{ id: 'u_abc', qty: 1, name: 'User item', unit_amount_cents: 500 }],
      },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const [, init] = global.fetch.mock.calls[0];
    expect(init.body).toContain('500');
  });

  it('responds 400 when more than 30 lines', async () => {
    const items = Array.from({ length: 31 }, (_, i) => ({
      id: `p${(i % 12) + 1}`,
      qty: 1,
    }));
    const req = createReq({ method: 'POST', body: { items } });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/30/);
  });

  it('responds 400 when total exceeds demo cap', async () => {
    const req = createReq({
      method: 'POST',
      body: {
        items: [{ id: 'u_bulk', qty: 99, unit_amount_cents: 999_900, name: 'Bulk demo line' }],
      },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/gioi han|giới hạn/);
  });

  it('responds 400 when Stripe returns error object', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Card declined' } }),
    });
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p2', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Card declined');
  });

  it('responds 500 when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'));
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p3', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('network down');
  });

  it('uses x-forwarded-proto and host for success_url base', async () => {
    const req = createReq({
      method: 'POST',
      headers: {
        'x-forwarded-proto': 'https',
        'x-forwarded-host': 'shop.example.com',
      },
      body: { items: [{ id: 'p4', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    const [, init] = global.fetch.mock.calls[0];
    expect(decodeURIComponent(init.body)).toContain('success_url=https://shop.example.com/success.html');
  });

  it('skips DB query when getSql returns null', async () => {
    getSqlImpl = null;
    const req = createReq({
      method: 'POST',
      body: { items: [{ id: 'p5', qty: 1 }] },
    });
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(mockSql).not.toHaveBeenCalled();
  });
});
