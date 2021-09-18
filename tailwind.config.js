module.exports = {
  purge: [],
  darkMode: false,
  theme: {
    extend: {
      transitionProperty: {
          'width': 'width'
      },
  },
    borderRadius: {
     DEFAULT: '5px',
    },
    height: {
      xl: '50px',
     },
     maxWidth: {
       '150': '150px',
       '205': '205px',
      '440': '440px',
      '723': '723px',
      '1024': '1024px'
     },
    colors: {
      blue: {
        DEFAULT: '#11B3FE',
        dark: '#0095E0',
      },
      gray: {
        lighter: '#F6F7F8',
        light: '#E3EBEF',
        dark: '#80A2B6',
        darkest: '#282828',
      },
      red:{
        DEFAULT: '#E03F3F',
      },
      white: {
        DEFAULT: 'white'
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
