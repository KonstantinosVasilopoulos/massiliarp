module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blue: {
          light: '#90acba',
          DEFAULT: '#65739a',
          dark: '#303f52',
        },
        'salmon-dark': '#c6a36b',
        'salmon-light': '#e5dec2',
        'silver': '#c0c0c0',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
