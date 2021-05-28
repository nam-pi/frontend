module.exports = {
  style: {
    postcss: {
      plugins: [
        require("tailwindcss"),
        require("postcss-focus-visible"),
        require("autoprefixer"),
      ],
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
