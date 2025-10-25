/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // ถ้าใช้ 127.0.0.1 ก็ใส่แทนได้
        port: '', // ถ้า XAMPP รันบน port 80 ปล่อยว่างไว้
        pathname: '/brand_api/**', // ตรงกับ path รูปจริง
      },
    ],
  },
};

module.exports = nextConfig;
