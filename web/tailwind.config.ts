import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0059e8',
        'primary-hover': '#0047c7',
        'sidebar-bg': '#0a1f4e',
        'page-bg': '#fcfdff',
        'card-bg': '#ffffff',
        'secondary-bg': '#f5f9ff',
        'main-text': '#0a2e6b',
        'muted-text': '#3b6dbf',
        accent: '#dcebff',
        border: '#cee3ff',
        destructive: '#ef4444',
        success: '#22c55e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'Arial Black', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.1)',
        input: '0 0 0 3px rgba(0,89,232,0.15)',
        'input-error': '0 0 0 3px rgba(239,68,68,0.15)',
      },
    },
  },
  plugins: [],
}

export default config
