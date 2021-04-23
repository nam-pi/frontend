const { override, addBabelPlugins } = require("customize-cra");

module.exports = override(
  addBabelPlugins([
    "react-intl",
    {
      extractFromFormatMessageCall: true,
      idInterpolationPattern: "[sha512:contenthash:base64:6]",
    },
  ])
);
