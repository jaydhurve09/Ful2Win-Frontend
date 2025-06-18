/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        active: "#FFC107",
        dullBlue: "#AECBF9",
        bgColor: "#000B18",
      },
      backgroundImage: {
        blueGradient: "linear-gradient(to bottom, #000B18, #002B5A, #00498E)",
        darkBlueGradient: "linear-gradient(to bottom, #021242, #0D34A7)",
      }
    },
  },
  plugins: [],
}

