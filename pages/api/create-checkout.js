/**
 * Stripe Checkout Session — Shopee demo (Next.js API Route)
 * Env: STRIPE_SECRET_KEY (sk_...)
 * POST JSON: { items: [{ id, qty, name?, unit_amount_cents? }] }
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

/** Canonical USD cents for seeded catalog ids (must match js/shopee-catalog.js SEED) */
const KNOWN_CENTS = {
  p1: 2990,
  p2: 1550,
  p3: 1200,
  p4: 4500,
  p5: 890,
  p6: 1820,
  p7: 1250,
  p8: 2400,
  p9: 5990,
  p10: 1999,
  p11: 3500,
  p12: 550,
  p13: 1890,
  p14: 1450,
  p15: 299,
  p16: 1600,
  p17: 950,
  p18: 1120,
};

function clampInt(n, min, max) {
  const x = parseInt(n, 10);
  if (Number.isNaN(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function resolveLine(item) {
  if (!item || typeof item.id !== 'string') return null;
  const qty = clampInt(item.qty, 1, 99);
  const known = KNOWN_CENTS[item.id];
  if (known != null) {
    const name =
      typeof item.name === 'string' && item.name.trim()
        ? item.name.trim().slice(0, 120)
        : `Product ${item.id}`;
    return { name, unit_amount: known, quantity: qty };
  }
  // User-added products in this demo use id prefix u_ or _demo_
  if (item.id.startsWith('u_') || item.id.includes('_demo_')) {
    const name =
      typeof item.name === 'string' && item.name.trim()
        ? item.name.trim().slice(0, 120)
        : 'Custom item';
    const raw = clampInt(item.unit_amount_cents, 50, 999_900);
    return { name, unit_amount: raw, quantity: qty };
  }
  return null;
}

function setCors(res) {
  Object.keys(CORS).forEach((k) => res.setHeader(k, CORS[k]));
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey || !stripeSecretKey.startsWith('sk_')) {
    res.status(500).json({
      error: 'Chưa cấu hình Stripe. Thêm STRIPE_SECRET_KEY (sk_...) trong Vercel → Project → Settings → Environment Variables.',
    });
    return;
  }

  const rawItems = Array.isArray(req.body?.items) ? req.body.items : [];
  const lines = rawItems.map(resolveLine).filter(Boolean);

  if (!lines.length) {
    res.status(400).json({ error: 'Giỏ hàng trống hoặc sản phẩm không hợp lệ.' });
    return;
  }
  if (lines.length > 30) {
    res.status(400).json({ error: 'Quá nhiều dòng (tối đa 30).' });
    return;
  }

  let sum = 0;
  for (const L of lines) sum += L.unit_amount * L.quantity;
  if (sum > 5_000_000) {
    res.status(400).json({ error: 'Tổng tiền vượt giới hạn demo.' });
    return;
  }

  try {
    const proto = (req.headers['x-forwarded-proto'] || 'https').toString();
    const host = (req.headers['x-forwarded-host'] || req.headers.host || '').toString();
    const baseUrl = `${proto}://${host}`.replace(/\/$/, '');

    const params = new URLSearchParams({
      mode: 'payment',
      success_url: `${baseUrl}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout.html`,
    });

    lines.forEach((L, i) => {
      const p = `line_items[${i}]`;
      params.append(`${p}[price_data][currency]`, 'usd');
      params.append(`${p}[price_data][product_data][name]`, L.name);
      params.append(`${p}[price_data][unit_amount]`, String(L.unit_amount));
      params.append(`${p}[quantity]`, String(L.quantity));
    });

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (data?.error) {
      res.status(400).json({ error: data.error.message || 'Stripe error' });
      return;
    }

    res.status(200).json({ url: data.url });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Server error' });
  }
}

