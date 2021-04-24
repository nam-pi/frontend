module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    textColor: ["visited"],
  },
  plugins: [require("@tailwindcss/forms")],
};
