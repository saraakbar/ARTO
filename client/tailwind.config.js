/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js, html}"],

  theme: {
    screen: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#fd3d57",
        'moonstone': '#5AB0C4',
        'light-orange': '#f4f3f2'
      },
    },
  },
  plugins: [],
};