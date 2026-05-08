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
          50:  "#f0f4ff",
          100: "#e0e9ff",
          500: "#4f6ef7",
          600: "#3b55e6",
          700: "#2d43cc",
          900: "#1a2680",
        },
        dark: {
          900: "#0a0e1a",
          800: "#111827",
          700: "#1f2937",
          600: "#374151",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-fintech": "linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0f1729 100%)",
      }
    },
  },
  plugins: [],
}
