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
        cyber: {
          bg: '#070a14',
          card: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(56, 189, 248, 0.18)',
          cyan: '#00f5ff',
          neonCyan: '#00f0ff',
          violet: '#8b5cf6',
          neonViolet: '#a855f7',
          pink: '#ec4899',
          neonPink: '#f43f5e',
          glass: 'rgba(13, 19, 36, 0.75)',
          glassLight: 'rgba(255, 255, 255, 0.04)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 245, 255, 0.45)',
        'glow-violet': '0 0 20px -3px rgba(139, 92, 246, 0.45)',
        'glow-pink': '0 0 20px -3px rgba(236, 72, 153, 0.45)',
        'neon-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px rgba(255, 255, 255, 0.08)'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.7), 0 0 30px rgba(0, 245, 255, 0.3)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 25px rgba(0, 245, 255, 0.9), 0 0 45px rgba(0, 245, 255, 0.5)',
            transform: 'scale(1.05)'
          },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s infinite ease-in-out',
        'float-slow': 'float-slow 6s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
