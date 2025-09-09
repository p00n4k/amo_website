const nextConfig = {
  output: 'export',
  trailingSlash: true,   // ✅ เพิ่ม slash หลังทุก path
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
}

module.exports = nextConfig
