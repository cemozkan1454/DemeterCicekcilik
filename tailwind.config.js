/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcf9',
          100: '#faf8f2',
          200: '#f5f0e6',
          300: '#ede5d3',
          400: '#e0d4ba',
          500: '#cdbf9a',
        },
        sage: {
          50: '#f3f6f2',
          100: '#e3eadd',
          200: '#c7d4bd',
          300: '#a5bb98',
          400: '#7e9c70',
          500: '#5f7d54',
          600: '#4a6742',
          700: '#3b5335',
          800: '#2f4229',
          900: '#243320',
        },
        blush: {
          50: '#fdf5f5',
          100: '#fae8e8',
          200: '#f4d0d0',
          300: '#ecaaaa',
          400: '#d77a7a',
          500: '#c25a5a',
        },
        charcoal: {
          700: '#3a3a38',
          800: '#2a2a28',
          900: '#1c1c1b',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-2': '0.25em',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'scale-in': 'scaleIn 1.2s ease-out forwards',
        'slide-right': 'slideRight 0.8s ease-out forwards',
        'slide-left': 'slideLeft 0.8s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
