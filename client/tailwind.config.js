/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#064E45',
          deep: '#032B26',
          dark: '#043F38',
          medium: '#087F6A',
          light: '#0E9B82',
          surface: '#0A5C52',
          muted: '#E6F0EE',
        },
        lime: {
          DEFAULT: '#DFFF72',
          bright: '#DFFF72',
          soft: '#E8FF9A',
          light: '#F3FFCC',
          dark: '#C7ED46',
        },
        surface: {
          bg: '#F7F8F2',
          card: '#FFFFFF',
          cardHover: '#FAFAF7',
          border: '#E3E8DE',
          muted: '#EFF2E9',
          sidebar: '#064E45',
          sidebarDark: '#043F38',
        },
        saas: {
          text: '#10201D',
          muted: '#5A6E69',
          light: '#8C9E9A',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px'
      },
      boxShadow: {
        'saas-card': '0 2px 14px -2px rgba(6, 78, 69, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'saas-hover': '0 12px 28px -4px rgba(6, 78, 69, 0.1), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'saas-float': '0 20px 40px -8px rgba(6, 78, 69, 0.16)',
        'lime-btn': '0 4px 18px 0 rgba(223, 255, 114, 0.45)',
        'emerald-btn': '0 4px 18px 0 rgba(6, 78, 69, 0.3)',
      }
    },
  },
  plugins: [],
}
