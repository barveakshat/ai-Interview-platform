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
        'background': '#12141D', // Primary background
        'card': '#1F2230',        // Card and sidebar background
        'text-primary': '#E5E7EB',
        'text-secondary': '#9CA3AF',
        'accent-blue': '#3B82F6',
        'accent-purple': '#9333EA',
        'border-subtle': 'rgba(229, 231, 235, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem', // Example for extra-large rounding
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6, #9333EA)',
      },
    },
  },
  plugins: [],
}