/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '5000',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'api.fakharnia.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'api.fakharnia.ir',
                pathname: '**'
            },
        ]
    },
    reactStrictMode: false
}

module.exports = nextConfig
