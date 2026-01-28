/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This is the "secret sauce" for Netlify to find your pages
  output: 'standalone', 
};

export default nextConfig;
