<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ytimg.com', 'mosaic.scdn.co', 'w.sndcdn.com', 'e-cdns-images.dzcdn.net'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ytimg.com', 'mosaic.scdn.co', 'w.sndcdn.com', 'e-cdns-images.dzcdn.net'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

>>>>>>> 0c5f55189a494bedfad37fe5688daf97b7f48f4a
module.exports = nextConfig 