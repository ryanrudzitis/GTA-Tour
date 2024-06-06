/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    // extend: {
    //   backgroundColor: {
    //     'default': "#22C55E"
    //   }
    // },
    extend: {
      scale: {
        '85': '0.85',
      }
    }
  },
  plugins: [require("daisyui")]
}

