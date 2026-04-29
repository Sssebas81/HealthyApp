/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Habilita el modo estricto de React
    images: {
        domains: ["example.com"], // Por ejemplo para permitir imágenes externas
    },
};

export default nextConfig;