/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: '/', destination: '/login.html' },
      { source: '/login', destination: '/login.html' },
      { source: '/home', destination: '/home.html' },
      { source: '/cart', destination: '/cart.html' },
      { source: '/checkout', destination: '/checkout.html' },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Cache-Control', value: 'no-store' }],
      },
    ];
  },
};

module.exports = nextConfig;

