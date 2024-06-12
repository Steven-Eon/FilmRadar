/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/css/style.css", "./views/*.hbs", "./views/**/*.hbs"],
  theme: {
    extend: {
      minWidth: {
        '20p': '20%',
        '40p': '40%',
        '60p': '60%',
        '80p': '80%',
        '100p': '100%',
      }
    },
  },
  plugins: [],
}

