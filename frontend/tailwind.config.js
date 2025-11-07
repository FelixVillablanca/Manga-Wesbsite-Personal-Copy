module.exports = {
  content: [
    "./index.html", // ← corrected typo from "html.index"
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}" // ← if you use @/components => for shadcn components
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwind-scrollbar')],
};