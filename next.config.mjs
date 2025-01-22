/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'rosewood.pk',
      'media.istockphoto.com',
      'm.media-amazon.com',  // Added amazon.com image domain
      'cdn.sanity.io',       // Added Sanity.io CDN domain
      'via.placeholder.com', // Added placeholder image domain
    ],
  },
};

export default nextConfig;
