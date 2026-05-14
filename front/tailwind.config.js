/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#fff4ed",
          100: "#ffe8d5",
          200: "#ffd0aa",
          300: "#ffb074",
          400: "#ff843c",
          500: "#e8611a",
          600: "#d4500f",
          700: "#b03d0b",
          800: "#8c3110",
          900: "#712a11",
        },
        cream: {
          50:  "#fdf8f3",
          100: "#faf0e6",
          200: "#f5e0cc",
        },
        dark: {
          800: "#2d2d2d",
          700: "#3d3d3d",
          600: "#4d4d4d",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
