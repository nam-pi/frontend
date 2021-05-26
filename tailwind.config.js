module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  variants: {
    extend: {
      opacity: ["disabled"],
      margin: ["first", "last"],
      padding: ["first", "last"],
    },
    textColor: ["visited", "hover"],
  },
  plugins: [require("@tailwindcss/forms")],
};
