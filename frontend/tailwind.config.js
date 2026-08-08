/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zen: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          borderHover: "#CBD5E1",
          primary: "#0F766E",       // Deep Jade Teal
          primaryHover: "#115E59",
          secondary: "#6366F1",     // Soft Iris
          ink: "#0F172A",
          muted: "#64748B",
          subtle: "#F1F5F9",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'zen': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'zen-lg': '0 20px 40px -15px rgba(15, 23, 42, 0.07), 0 8px 16px -6px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
}
