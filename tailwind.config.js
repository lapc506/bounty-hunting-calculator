/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

// Design Tokens - Sistema de colores
const tokens = {
  colors: {
    // Borders - Responden a dark mode
    border: {
      light: '#e2e8f0',  // slate-200
      dark: '#334155',   // slate-700
    },
    // Background
    bg: {
      light: {
        primary: '#ffffff',
        secondary: '#f1f5f9',
      },
      dark: {
        primary: '#1e293b',   // slate-800
        secondary: '#0f172a', // slate-900
      },
    },
    // Text
    text: {
      light: {
        primary: '#0f172a',
        secondary: '#64748b',
      },
      dark: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
      },
    },
  },
};

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'sans-serif'],
      },
      colors: {
        // Sistema de tokens exportados
        'token-border-light': tokens.colors.border.light,
        'token-border-dark': tokens.colors.border.dark,
      },
    },
  },
  plugins: [],
});
