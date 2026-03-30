const crypto = require('node:crypto');
const { randomFillSync, webcrypto } = crypto;

function installGetRandomValues(target) {
  if (typeof target.getRandomValues === 'function') return target;
  Object.defineProperty(target, 'getRandomValues', {
    value: (typedArray) => {
      if (!typedArray || typeof typedArray !== 'object' || typeof typedArray.byteLength !== 'number') {
        throw new TypeError('Expected an ArrayBufferView');
      }
      randomFillSync(typedArray);
      return typedArray;
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
  return target;
}

// Node 16 may not provide a WebCrypto global. Vite expects crypto.getRandomValues at least.
if (!globalThis.crypto) {
  globalThis.crypto = {};
}

// Prefer real webcrypto when available, but always ensure getRandomValues exists.
if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
  globalThis.crypto = webcrypto;
} else {
  installGetRandomValues(globalThis.crypto);
}

// Vite 5 uses `import crypto from 'node:crypto'` and calls `crypto.getRandomValues(...)`.
// Node 16's `node:crypto` export object doesn't have getRandomValues, so patch it too.
if (typeof crypto.getRandomValues !== 'function') {
  Object.defineProperty(crypto, 'getRandomValues', {
    value: (typedArray) => {
      if (!typedArray || typeof typedArray !== 'object' || typeof typedArray.byteLength !== 'number') {
        throw new TypeError('Expected an ArrayBufferView');
      }
      randomFillSync(typedArray);
      return typedArray;
    },
    configurable: true,
    enumerable: false,
    writable: true,
  });
}
