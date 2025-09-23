/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#09122C', // Dark Background
        'card': '#1B1A55',        // Card Backgrounds
        'sidebar-selection': '#2F323A', // Sidebar Selection
        'text-primary': '#ffffffff',       // Text & Icons
        'text-secondary': '#B0B0B0',      // Muted text
        'accent-blue': '#4F70FE',        // Primary blue
        'accent-purple': '#8B50F7',      // Purple from gradient
        'border-subtle': 'rgba(224, 224, 224, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #4F70FE, #8B50F7)',
        'gradient-blue-purple': 'linear-gradient(to right, #4F70FE, #8B50F7)',
      },
    },
  },
  plugins: [],
}