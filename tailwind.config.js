/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'default': "#22C55E"
      }
    },
  },
  plugins: [require("daisyui")]
}

