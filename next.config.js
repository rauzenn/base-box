// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-ancestors 'self' https://*.warpcast.com https://*.farcaster.xyz https://*.onbasebuild.com;",
          },
          // Explicitly remove X-Frame-Options to avoid conflicts with CSP frame-ancestors
          {
            key: 'X-Frame-Options',
            value: '', // Empty value removes the header
          },
        ],
      },
    ];
  },
  // Optimize image handling
  images: {
    domains: ['basebox.vercel.app'],
  },
};

module.exports = nextConfig;