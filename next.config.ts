import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          typescript: true,
          dimensions: false,
        }
      }]
    })

    return config
  }
}
// next.config.js
// module.exports = {
//   images: {
//     loader: 'custom',
//     loaderFile: './src/utils/cloudinary-loader.ts',
//   }
// }

export default nextConfig
