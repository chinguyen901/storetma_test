import { getSql } from './_db';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const ALLOWED_CATEGORIES = new Set([
  'all',
  'fashion',
  'electronics',
  'beauty',
  'home',
  'gaming',
  'supermarket',
  'accessories',
  'kids',
  'sports',
  'misc',
]);

function setCors(res) {
  Object.keys(CORS).forEach((k) => res.setHeader(k, CORS[k]));
}

function normalizeLimit(v, def) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return def;
  return Math.max(1, Math.min(100, n));
}

function normalizeOffset(v) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, n);
}

function sortClause(sort) {
  if (sort === 'priceAsc') return 'price_cents ASC, created_at DESC';
  if (sort === 'priceDesc') return 'price_cents DESC, created_at DESC';
  if (sort === 'nameAsc') return 'name_vi ASC, created_at DESC';
  return 'created_at DESC';
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') return res.status(204).end('');
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const sql = getSql();
  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL chưa được cấu hình trên Vercel.' });
  }

  const section = req.query.section === 'flash' ? 'flash' : 'daily';
  const categoryRaw = String(req.query.category || 'all').trim();
  const category = ALLOWED_CATEGORIES.has(categoryRaw) ? categoryRaw : 'all';
  const q = String(req.query.q || '').trim().toLowerCase();
  const sort = String(req.query.sort || 'relevance');
  const limit = normalizeLimit(req.query.limit, section === 'flash' ? 12 : 24);
  const offset = normalizeOffset(req.query.offset);
  const orderBy = sortClause(sort);

  try {
    const rows = await sql(
      `
        SELECT id, name_vi, name_en, price_cents, image, section, category, badge, created_at
        FROM products
        WHERE section = $1
          AND ($2 = 'all' OR category = $2)
          AND (
            $3 = ''
            OR LOWER(name_vi) LIKE ('%' || $3 || '%')
            OR LOWER(name_en) LIKE ('%' || $3 || '%')
          )
        ORDER BY ${orderBy}
        LIMIT $4 OFFSET $5
      `,
      [section, category, q, limit, offset]
    );

    const countRows = await sql(
      `
        SELECT COUNT(*)::int AS total
        FROM products
        WHERE section = $1
          AND ($2 = 'all' OR category = $2)
          AND (
            $3 = ''
            OR LOWER(name_vi) LIKE ('%' || $3 || '%')
            OR LOWER(name_en) LIKE ('%' || $3 || '%')
          )
      `,
      [section, category, q]
    );

    const total = countRows?.[0]?.total || 0;
    const items = rows.map((r) => ({
      id: r.id,
      nameVi: r.name_vi,
      nameEn: r.name_en,
      price_cents: r.price_cents,
      image: r.image,
      section: r.section,
      category: r.category,
      badge: r.badge || '',
    }));

    res.status(200).json({
      items,
      total,
      hasMore: offset + items.length < total,
      nextOffset: offset + items.length,
    });
  } catch (e) {
    res.status(500).json({ error: e?.message || 'DB query failed' });
  }
}

