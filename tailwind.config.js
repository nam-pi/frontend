module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false,
  theme: {
    minWidth: {
      0: "0",
      1: "1rem",
      2: "2rem",
      4: "4rem",
      6: "6rem",
      8: "8rem",
      64: "16rem",
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
