/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eeedfb',
          100: '#d5d3f6',
          200: '#aba7ed',
          300: '#817be4',
          400: '#574fdb',
          500: '#3324BC',
          600: '#2c1fa3',
          700: '#251a8a',
          800: '#1e1571',
          900: '#171058',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
}
