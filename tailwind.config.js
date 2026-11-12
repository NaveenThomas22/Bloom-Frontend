/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F5F8F4',
          100: '#E7EFE6',
          200: '#DCE9D9', // Soft Mint
          300: '#C3D7BF',
          400: '#A8BDA5', // Primary Sage Green
          500: '#8DA58A',
          600: '#6C8569',
          700: '#546B52',
          800: '#405B49', // Forest Green
          900: '#2A3C30',
          950: '#1B2720',
        },
        ivory: {
          DEFAULT: '#F8F5EB',
          50: '#FFFFFF',
          100: '#FDFCF9',
          200: '#F8F5EB', // Ivory
          300: '#EFE9D7',
          400: '#E6DDC3',
        },
        mint: {
          DEFAULT: '#DCE9D9',
          light: '#EDF5EB',
          dark: '#B8CDB5',
        },
        rose: {
          DEFAULT: '#E9C9C5', // Dusty Rose
          light: '#F5E4E2',
          dark: '#D4A39D',
        },
        beige: {
          DEFAULT: '#E9E0D1', // Warm Beige
          light: '#F3EFE7',
          dark: '#D4C6B1',
        },
        forest: {
          DEFAULT: '#405B49',
          light: '#567661',
          dark: '#2F4335',
        },
        // Dark theme tokens
        dark: {
          bg: '#141A17',
          card: '#1D2521',
          surface: '#26322C',
          border: '#33423A',
          text: '#F8F5EB',
          muted: '#9FB1A5',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(64, 91, 73, 0.06)',
        'soft': '0 4px 20px -2px rgba(64, 91, 73, 0.08)',
        'soft-lg': '0 10px 30px -4px rgba(64, 91, 73, 0.12)',
        'soft-xl': '0 20px 40px -6px rgba(64, 91, 73, 0.16)',
        'dark-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      padding: {
        'safe-bottom': 'env(safe-area-inset-bottom, 16px)',
        'safe-top': 'env(safe-area-inset-top, 16px)',
      }
    },
  },
  plugins: [],
}

