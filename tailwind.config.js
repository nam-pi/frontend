module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
    textColor: ["visited", "hover"],
  },
  plugins: [require("@tailwindcss/forms")],
};
