/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    authInterrupts: true,
    optimizeCss: false,
  },
  images: {
    // remotePatterns: [
    //   {
    //     protocol: "https",
    //     hostname: "media.themoviedb.org",
    //     port: "",
    //     pathname: "/**",
    //     search: "",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "placehold.co",
    //     port: "",
    //     pathname: "/**",
    //     search: "",
    //   },
    //   {
    //     protocol: "https",
    //     hostname: "m.media-amazon.com",
    //     port: "",
    //     pathname: "/**",
    //     search: "",
    //   },
    // ],
    domains: [
      "media.themoviedb.org",
      "placehold.co",
      "m.media-amazon.com",
      "image.tmdb.org",
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

module.exports = nextConfig;
