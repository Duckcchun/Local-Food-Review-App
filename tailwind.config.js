/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // 기본 사이즈를 약간 키움
        xs: ['13px', { lineHeight: '18px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '26px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
      },
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
