/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'ui-avatars.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;
