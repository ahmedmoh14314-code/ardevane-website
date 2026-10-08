/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wcrznygqwtvajancczhq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/cabin-images/**",
      },
    ],
  },
  // My Stay used to live inside the account pages
  async redirects() {
    return [
      { source: "/account/stay", destination: "/my-stay", permanent: false },
      {
        source: "/account/stay/menu",
        destination: "/my-stay/menu",
        permanent: false,
      },
    ];
  },
  // output: "export",
};

export default nextConfig;
