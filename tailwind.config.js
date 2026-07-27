/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          white: '#ffffff',
          crimson: '#E31837',
        },
        division: {
          design: '#E31837',
          shop: '#F97316',
          software: '#3B82F6',
          labs: '#A855F7',
          ai: '#06B6D4',
          academy: '#10B981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'btn': '14px',
        'lg': '18px',
        'card': '20px',
        'pill': '999px',
      }
    },
  },
  plugins: [],
}
