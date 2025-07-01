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
        whiteGradient: "linear-gradient(to bottom right, #ffffff, #f0f0f0)",
        // blueGradient: "linear-gradient(to bottom, #000B18, #002B5A, #00498E)",
        blueGradient: "linear-gradient(to bottom, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
        blueHorizontalGradient: "linear-gradient(to left, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
        darkBlueGradient: "linear-gradient(to bottom, #021242, #0D34A7)",
        neonBlueGradient: "linear-gradient(to bottom right, #00cfff, #00b8ff, #007bff)",
        glassDark: "linear-gradient(to bottom right, rgba(31, 41, 55, 0.1), rgba(0, 0, 0, 0.1))",
        blueGradient: "linear-gradient(to bottom right, #1565C0, #0D47A1, #0A2472)",
        communityGradient:"linear-gradient(to bottom, #1565C0 0%, #0D47A1 42%, #0A2472 100%)",
    
      }
    },
  },
  plugins: [],
}

