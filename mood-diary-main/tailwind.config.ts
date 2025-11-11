/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      colors: {
        bgLight: "#f6f6f6",
        btnLight: "#ececec",
        lineLight: "#e2e2e2",
        bgDark: "#2b2d31",
        mainDark: "#1e1f22",
        btnDark: "#313338",
        lineDark: "#3F4147",
        yellow: "#fdce17",
        orange: "#fd8446",
        red: "#fd565f",
        yellowGreen: "#9dd772",
        green: "#64c964",
      },
    },
  },
  plugins: [],
};
