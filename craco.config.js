module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  babel: {
    plugins: [
      [
        "react-intl",
        {
          extractFromFormatMessageCall: true,
          idInterpolationPattern: "[sha512:contenthash:base64:6]",
        },
      ],
    ],
  },
};
