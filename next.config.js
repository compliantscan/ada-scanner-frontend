const path = require('node:path');

// The local Windows environment runs Node 24, where the native SWC binary is
// not loadable. Use Next's official WASM compiler locally; Vercel keeps using
// its native compiler.
if (process.platform === 'win32' && Number(process.versions.node.split('.')[0]) >= 24) {
  process.env.NEXT_TEST_WASM_DIR = path.join(
    __dirname,
    'node_modules',
    '@next',
    'swc-wasm-nodejs'
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
