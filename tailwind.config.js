module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    minWidth: {
      0: "0",
      1: "1em",
      2: "2em",
      4: "4em",
      6: "6em",
      8: "8em",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
    },
    extend: {
      width: { sm: "640px", md: "768px", lg: "1024px" },
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      margin: ["first", "last"],
      padding: ["first", "last"],
      textColor: ["visited", "hover"],
      ringColor: ["focus-visible"],
      ringWidth: ["focus-visible"],
      ringOffsetWidth: ["focus-visible"],
      cursor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
