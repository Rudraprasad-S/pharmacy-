/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2ff",
          100: "#dbe4ff",
          200: "#bac8ff",
          300: "#91a7ff",
          400: "#748ffc",
          500: "#2E73F6",  // Royal blue — primary CTA
          600: "#1d5fd9",
          700: "#1a4cb5",
          800: "#12378C",  // Deep navy — dark accents
          900: "#0c2560",
          950: "#0f1a3a",  // Dark mode bg
        },
      },
      fontFamily: {
        sans: ["Inter", "Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
