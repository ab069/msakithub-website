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
        accent: '#F1433A',
        accent2: '#FF6B4A',
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
