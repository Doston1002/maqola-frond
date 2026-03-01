// Backend manzili .env dan — development va production uchun alohida o'qiladi
// DEV: NEXT_PUBLIC_API_SERVICE_DEV (masalan http://localhost:8000)
// PROD: NEXT_PUBLIC_API_SERVICE (masalan https://api.sizning-domeningiz.uz)
const rawBackend =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_SERVICE
    : process.env.NEXT_PUBLIC_API_SERVICE_DEV || process.env.NEXT_PUBLIC_API_SERVICE;

const backendHost = ((rawBackend || 'http://localhost:8000').trim()).replace(/\/api\/?$/, '');
// PDF iframe uchun backend HTTPS bo'lsa frame-src ga qo'shamiz
const frameSrcList = ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'];
if (backendHost.startsWith('https://')) {
  frameSrcList.push(backendHost);
}

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "frame-ancestors 'none'",
      'frame-src ' + frameSrcList.join(' '),
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 " + backendHost + " https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz",
    ].join('; '),
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // react-quill va boshqa ESM paketlar buildda to'g'ri bundle bo'lishi uchun
  transpilePackages: ['react-quill-new'],
  // Lokal development: /api so'rovlari backend (8000) ga yo'naltiriladi, CORS kerak emas
  async rewrites() {
    const target = backendHost || 'http://localhost:8000';
    const nextAuthPaths = [
      '/api/auth/session',
      '/api/auth/csrf',
      '/api/auth/providers',
      '/api/auth/signin',
      '/api/auth/error',
    ];
    const nextAuthRewrites = nextAuthPaths.map((p) => ({ source: p, destination: p }));
    return [
      // NextAuth: faqat session/signin/callback va h.k. Next.js da
      ...nextAuthRewrites,
      { source: '/api/auth/signin/:path*', destination: '/api/auth/signin/:path*' },
      { source: '/api/auth/callback/:path*', destination: '/api/auth/callback/:path*' },
      // PDF proxy Next.js da qoladi (backenddan olib iframe ga beradi)
      { source: '/api/proxy-pdf', destination: '/api/proxy-pdf' },
      { source: '/api/:path*', destination: `${target}/api/:path*` },
      { source: '/uploads/:path*', destination: `${target}/uploads/:path*` },
    ];
  },
  // Eski admin sahifalar o'chirilgani uchun dashboard ga yo'naltirish
  async redirects() {
    return [
      { source: '/admin/users', destination: '/admin', permanent: false },
      { source: '/admin/courses', destination: '/admin', permanent: false },
      { source: '/admin/books', destination: '/admin/collections', permanent: false },
      { source: '/admin/instructors', destination: '/admin', permanent: false },
      { source: '/admin/questions', destination: '/admin', permanent: false },
      { source: '/admin/attendance-messages', destination: '/admin', permanent: false },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uydatalim.uzedu.uz', // barcha uploads ichidagi papkalarga ruxsat beradi
      },
      {
        protocol: 'https',
        hostname: 'media.graphassets.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost', // portni alohida yozish shart emas
        port: '8000', // bo'sh qoldiring
      },
      {
        protocol: 'https',
        hostname: 'uydatalim.uzedu.uz',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // 8000 o'rniga bo'sh qoldiring
        pathname: '/uploads/**',
      },
    ],
  },
  async headers() {
    return [
      // PDF proxy — iframe da ko'rsatish uchun SAMEORIGIN
      {
        source: '/api/proxy-pdf',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
