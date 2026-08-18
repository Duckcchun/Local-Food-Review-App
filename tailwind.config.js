/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 앱 브랜드 색상
        brand: {
          green: '#6b8e6f',
          'green-dark': '#5a7a5e',
          'green-light': '#8fa893',
          orange: '#f5a145',
          'orange-dark': '#e89535',
          beige: '#f5f0dc',
          'beige-dark': '#d4c5a0',
          cream: '#fffef5',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
