/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";

// Material Design 3 Baseline Color Scheme basado en #0F172A
const md3Colors = {
  primary: {
    0: '#000000',
    10: '#001f3a',
    20: '#003355',
    25: '#003d63',
    30: '#004872',
    35: '#005382',
    40: '#005e92',
    50: '#0077b6',
    60: '#0091d0',
    70: '#00adee',
    80: '#36c9ff',
    90: '#8fffff',
    95: '#b3ffff',
    99: '#f3ffff',
    100: '#ffffff',
  },
  secondary: {
    0: '#000000',
    10: '#1a2a3a',
    20: '#2c3f50',
    25: '#364a5d',
    30: '#41556a',
    35: '#4c6076',
    40: '#586b82',
    50: '#6f7a8f',
    60: '#8a8fa0',
    70: '#a5aab5',
    80: '#c1c7d0',
    90: '#dde1eb',
    95: '#ebeef7',
    99: '#fafbff',
    100: '#ffffff',
  },
  tertiary: {
    0: '#000000',
    10: '#2a1a2a',
    20: '#402a40',
    25: '#4d354d',
    30: '#5a405a',
    35: '#674b67',
    40: '#755675',
    50: '#8e6b8e',
    60: '#a882a8',
    70: '#c39ac3',
    80: '#dfb3df',
    90: '#fac3ff',
    95: '#ffd7ff',
    99: '#fffbfe',
    100: '#ffffff',
  },
  neutral: {
    0: '#000000',
    10: '#191c1f',
    20: '#2d3134',
    25: '#383c40',
    30: '#43474b',
    35: '#4f5357',
    40: '#5a5e62',
    50: '#72767b',
    60: '#8b9094',
    70: '#a5aaaf',
    80: '#c0c5ca',
    90: '#dce1e6',
    95: '#eef0f5',
    99: '#fffbfe',
    100: '#ffffff',
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
        // Material Design 3 - Primary
        primary: md3Colors.primary,
        // Material Design 3 - Secondary
        secondary: md3Colors.secondary,
        // Material Design 3 - Tertiary
        tertiary: md3Colors.tertiary,
        // Material Design 3 - Neutral (grays)
        neutral: md3Colors.neutral,
        // Semantic tokens for light mode
        'light-on-primary': md3Colors.primary[100],
        'light-on-secondary': md3Colors.secondary[100],
        'light-on-tertiary': md3Colors.tertiary[100],
        'light-background': md3Colors.neutral[99],
        'light-surface': md3Colors.neutral[99],
        'light-on-surface': md3Colors.neutral[10],
        // Semantic tokens for dark mode
        'dark-on-primary': md3Colors.primary[20],
        'dark-on-secondary': md3Colors.secondary[20],
        'dark-on-tertiary': md3Colors.tertiary[20],
        'dark-background': md3Colors.neutral[10],
        'dark-surface': md3Colors.neutral[10],
        'dark-on-surface': md3Colors.neutral[90],
      },
    },
  },
  plugins: [],
});
