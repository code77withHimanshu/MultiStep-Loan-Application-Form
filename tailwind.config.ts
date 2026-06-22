import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: '#1F4E79',
          50: '#e8f0f8',
          100: '#c5d8ed',
          200: '#9ebede',
          300: '#77a4cf',
          400: '#5790c4',
          500: '#377db9',
          600: '#2c6ca3',
          700: '#255987',
          800: '#1F4E79',
          900: '#163a5c',
        },
        accent: {
          DEFAULT: '#27AE60',
          50: '#e8f8ef',
          100: '#c5edd8',
          200: '#9ce0bf',
          300: '#73d3a6',
          400: '#52c993',
          500: '#31be80',
          600: '#27AE60',
          700: '#1f9450',
          800: '#177a40',
          900: '#0f6030',
        },
        error: {
          DEFAULT: '#E74C3C',
        },
        warning: {
          DEFAULT: '#F39C12',
        },
      },
      boxShadow: {
        card: '0 8px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
        'btn-primary': '0 4px 12px rgba(31,78,121,0.35)',
        'btn-success': '0 4px 12px rgba(39,174,96,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config
