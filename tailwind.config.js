/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand color palette
        'brand': {
          primary: '#2d287f',    // Main brand color (dark purple-blue)
          accent: '#2b2b2b',     // Accent color (dark gray)
          light: '#f8f9fa',      // Light background
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Segoe UI'", 'sans-serif'],
      },
      boxShadow: {
        'md-purple': '0 8px 30px rgba(17,13,40,0.08)',
        'sm-purple': '0 6px 18px rgba(17,13,40,0.06)',
      },
    },
  },
  plugins: [],
}
