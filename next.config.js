/** @type {import('next').NextConfig} */
const nextConfig = {
  // Farcaster embed için gerekli header'lar
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://*.warpcast.com',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.warpcast.com https://*.farcaster.xyz;",
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  // Görsel dosyaları için domain izinleri
  images: {
    domains: ['basebox.vercel.app'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
};

module.exports = nextConfig;