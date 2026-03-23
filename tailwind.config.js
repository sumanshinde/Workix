/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-inter)', 'sans-serif'], // Clean sans-serif hierarchy
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Core Primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        indigo: {
          500: '#6366f1',
          600: '#4f46e5', // Core Secondary
        },
        slate: {
          100: '#f1f5f9', // Borders
          500: '#64748b', // Body Text
          900: '#0f172a', // Headings
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'layered': '0 10px 40px -10px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.03)',
        'blue-glow': '0 10px 40px -10px rgba(37,99,235,0.25)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
