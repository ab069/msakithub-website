/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        archivo: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: '#0B0C10',
        surface: '#12131A',
        card: '#151725',
        line: '#232530',
        accent: '#7C5CFF',
        accent2: '#A78BFA',
        muted: '#8B8D98',
        cream: '#F5F6FA',
      },
      maxWidth: {
        site: '1480px',
      },
    },
  },
  plugins: [],
};
