/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', 
      'graph.facebook.com', 
      'platform-lookaside.fbsbx.com',
      'scontent.xx.fbcdn.net',
      'static.xx.fbcdn.net',
      'facebook.com',
      'fbcdn.net',
      'fbsbx.com'
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3001/api'
  },
  // Optimización para reducir problemas de carga de chunks
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
          priority: 10,
        },
        // Optimización específica para Facebook Auth
        auth: {
          name: 'auth',
          test: /[\\/]node_modules[\\/](next-auth|@auth)[\\/]/,
          chunks: 'all',
          priority: 20,
        },
      },
    };
    // Reducir el tamaño de los chunks
    config.optimization.chunkIds = 'deterministic';
    return config;
  }
}

module.exports = nextConfig