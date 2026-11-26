/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export for GitHub Pages (served from the root of kalpkj.github.io).
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
