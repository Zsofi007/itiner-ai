/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "DM Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "Instrument Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgb(0 0 0 / 0.08), 0 8px 16px -8px rgb(0 0 0 / 0.12)",
        "soft-dark":
          "0 4px 24px -4px rgb(0 0 0 / 0.35), 0 8px 16px -8px rgb(0 0 0 / 0.45)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
