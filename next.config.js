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
              "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; connect-src 'self' https:; frame-ancestors 'self' https://warpcast.com https://*.warpcast.com https://farcaster.xyz https://*.farcaster.xyz https://*.coinbase.com https://*.onbasebuild.com https://*.vercel.app https://*.vercel.live http://localhost:3000;",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // wagmi'nin baseAccount connector'ı, biz hiç kullanmadığımız bir
    // özelliği (Base Pay / ödeme "charge" arayüzü) kendi içinde
    // barındırıyor. O özellik @coinbase/cdp-sdk'yi, o da x402 ödeme
    // protokolü paketlerini (@x402/evm vb.) import ediyor — bunlar ayrıca
    // kurulması gereken, opsiyonel paketler ve biz ödeme özelliğini hiç
    // çağırmıyoruz (sadece cüzdan bağlama/connect için baseAccount
    // kullanıyoruz).
    //
    // @react-native-async-storage/async-storage ve pino-pretty ise
    // MetaMask SDK / WalletConnect'in React Native ortamı ve Node.js'te
    // "pretty" log basmak için kullandığı, tarayıcıda hiç gerekmeyen
    // opsiyonel bağımlılıklar — wagmi/RainbowKit ekosisteminde bilinen,
    // standart bir build sorunu, resmi çözümü de tam olarak bu.
    //
    // Hiçbiri projede gerçekten çalıştırılmayan kod yollarında, o yüzden
    // webpack'e "bunları bulamazsan boş modül say / bundle'a hiç dahil
    // etme" diyoruz; gerçek işlevselliği etkilemiyor.
    config.resolve.alias = {
      ...config.resolve.alias,
      '@coinbase/cdp-sdk': false,
      '@x402/evm': false,
      '@react-native-async-storage/async-storage': false,
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    config.externals = [...(config.externals || []), 'pino-pretty', 'lokijs', 'encoding'];
    return config;
  },
};

module.exports = nextConfig;