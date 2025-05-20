/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001/api'
  }
}

module.exports = nextConfig