/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io", "upload.wikimedia.org"],
  },
};

module.exports = nextConfig;
