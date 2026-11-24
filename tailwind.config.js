/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          700: '#1E3A8A',
          800: '#0F2744',
          900: '#0A192F',
          950: '#050D1A',
        },
        teal: {
          800: '#0C4A56',
          900: '#0A3B45',
          950: '#062830',
        },
        canvas: {
          DEFAULT: '#FBFBF9',
          card: '#FFFFFF',
          muted: '#F5F4F0',
          tint: '#EFECE6',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Newsreader', 'Merriweather', 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft-pill': '0 4px 20px -2px rgba(10, 25, 47, 0.08), 0 2px 6px -1px rgba(10, 25, 47, 0.04)',
        'elevated': '0 12px 32px -4px rgba(10, 25, 47, 0.12), 0 4px 12px -2px rgba(10, 25, 47, 0.06)',
      },
    },
  },
  plugins: [],
};
