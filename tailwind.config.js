/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{html,jsx}",
    "./components/**/*.{html,jsx}",
    "./skeleton/**/*.{html,jsx}",
    "index.html",
  ],
  theme: {
    extend: {
      colors: {
        quotee: {
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#4d4d4d",
          700: "#434343",
          800: "#383838",
          900: "#313131",
          950: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};
