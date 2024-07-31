/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'biruxl': '#6F2B90',
        'deep-blue': '#39245d',
        'sea-blue': '#3178C7',
        'xl-warning': '#FC4C00',
        'xl-pink': '#EB008B',
        'green-success': '#0AC4A9',
        'deep-gray': '#68788A',
        'light-gray': '#E2E2E2',
        'light-blue': '#F4EBF9',
        'top-landing': '18448A',
        'bottom-landing': '#82D4B2'
      },
      fontFamily: {
        'Museo-Light': ['Museo-Light'],
        'Museo': ['Museo'],
        'Museo-Medium': ['Museo-Medium'],
        'Museo-Bold': ['Museo-Bold']
      },
      backgroundImage: theme => ({
        'footer': "url('/footer.svg')",
      })
    },
    letterSpacing: {
      tightest: '-.075em',
      tighter: '-.05em',
      tight: '-.025em',
      normal: '0',
      wide: '.025em',
      wider: '.05em',
      widest: '.1em',
      widests: '.95em',
      extra: '.50'
    },
    container: {
      screens: {
        sm: "100%",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        screens: {
          'tablet': '360px',
          // => @media (min-width: 640px) { ... }

          'laptop': '1024px',
          // => @media (min-width: 1024px) { ... }

          'desktop': '1280px',
          // => @media (min-width: 1280px) { ... }
        },
      }
    },
  },
  plugins: [
    require('tailwindcss'),
    require('precss'),
    require('autoprefixer')
  ],
}
