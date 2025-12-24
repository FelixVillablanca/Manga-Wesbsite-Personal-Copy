module.exports = {
  content: [
    "./index.html", // ← corrected typo from "html.index"
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}" // ← if you use @/components => for shadcn components
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up' : {
          '0%' : {
            opacity: 0,
            transform : 'translateY(20px)'
          },
          '100%' : {
            opacity: 1,
            transform : 'translateY(0)'
          },
        },
      },
      animation : {
        'fade-in-up' : 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwind-scrollbar')],
};