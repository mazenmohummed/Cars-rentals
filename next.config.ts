/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
       protocol: 'https',
        hostname: '6wm9vqbvf2.ufs.sh', // This is your specific UploadThing domain
        port: '',
        pathname: '/f/**', // This allows all files from that path 
      },
      {
        protocol: 'https',
        hostname: 'tse4.mm.bing.net', // Add the Bing domain for your City cards
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200], // Helps Next.js create smaller versions
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;