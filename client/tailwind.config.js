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
          light: '#4CAF50',
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
        },
        secondary: {
          light: '#F5F5F5',
          DEFAULT: '#E0E0E0',
          dark: '#9E9E9E',
        },
        dark: '#121212',
        light: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
