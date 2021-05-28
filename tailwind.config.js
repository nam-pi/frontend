module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  variants: {
    extend: {
      opacity: ["disabled"],
      margin: ["first", "last"],
      padding: ["first", "last"],
      textColor: ["visited", "hover"],
      ringColor: ["focus-visible"],
      ringWidth: ["focus-visible"],
      ringOffsetWidth: ["focus-visible"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
