/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef1f8',
          100: '#fee5f3',
          200: '#ffcae6',
          300: '#ffa0d1',
          400: '#ff66b2', // Core Vibrant Pink/Coral
          500: '#fd3b93',
          600: '#ed1570',
          700: '#c80d58',
          800: '#a60f4b',
          900: '#8b1142',
          950: '#550524',
        },
        trust: {
          50: '#effef2',
          100: '#dafee4',
          200: '#b8facb',
          300: '#80f1a4',
          400: '#43e076',
          500: '#1fc456', // Core Trust Green
          600: '#12a342',
          700: '#128137',
          800: '#13652f',
          900: '#125328',
          950: '#062e13',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'up': '0 -4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      }
    },
  },
  plugins: [],
}
