/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
};

export default nextConfig;
