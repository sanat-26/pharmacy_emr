/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crmGreen: "#e6f8f1",
        crmGreenText: "#18b76c",
        crmBlue: "#e5f4ff",
        crmBlueText: "#008eff",
        crmOrange: "#fff0e6",
        crmOrangeText: "#ff8c00",
        crmPurple: "#f5e6ff",
        crmPurpleText: "#b11cf2",
        crmPrimary: "#1877f2"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
