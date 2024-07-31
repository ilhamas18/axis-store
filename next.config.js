const path = require("path");
require("dotenv").config();
const webpack = require("webpack");

const ContentSecurityPolicy = `frame-ancestors 'none'`;

module.exports = {
  trailingSlash: false,
  // webpackDevMiddleware: (config) => {
  //   config.watchOptions = {
  //     poll: 1000,
  //     aggregateTimeout: 300,
  //   };

  //   return config;
  // },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    GOOGLE_RECAPTCHA_KEY: process.env.GOOGLE_RECAPTCHA_KEY,
    GOOGLE_RECAPTCHA_SECRET: process.env.GOOGLE_RECAPTCHA_SECRET,
    API_URL_MW: process.env.API_URL_MW,
    AUTH_MW: process.env.AUTH_MW
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "images.pexels.com",
      "staticxl.ext.xlaxiata.co.id",
      "g20-indonesia.s3.ap-southeast-1.amazonaws.com",
      "api.midtrans.com"
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};
