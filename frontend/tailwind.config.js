/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        propai: { blue: '#1B3B6F', teal: '#0EA5E9', gold: '#F59E0B', mint: '#10B981' }
      },
      fontFamily: { heading: ['Poppins', 'sans-serif'] },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.14)'
      }
    }
  },
  plugins: []
}
