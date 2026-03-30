/**
 * Minimal req/res mocks for Next.js Pages API handlers.
 */
export function createRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    ended: undefined,
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    end(s) {
      this.ended = s ?? '';
      return this;
    },
  };
  return res;
}

export function createReq(overrides = {}) {
  return {
    method: 'GET',
    query: {},
    headers: {},
    body: {},
    ...overrides,
  };
}
