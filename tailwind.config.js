import { nextui } from "@nextui-org/react";
import theme from "./src/Utilities/Theme"
/** @type {import('tailwindcss').Config} */
export default {
  // Define where Tailwind should look for class usage to remove unused styles in production
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],

  // Customization of the default theme
  theme: {
    extend: {
      // Extend Tailwind's default colors, fonts, and spacing for a unique design system
      colors: {
        light: {
          background: theme.colors.light.background,
          foreground: theme.colors.light.foreground,
          primary: theme.colors.light.primary,
          secondary: theme.colors.light.secondary,
          accent: theme.colors.light.accent,
          muted: theme.colors.light.muted,
        },
        dark: {
          background: theme.colors.dark.background,
          foreground: theme.colors.dark.foreground,
          primary: theme.colors.dark.primary,
          secondary: theme.colors.dark.secondary,
          accent: theme.colors.dark.accent,
          muted: theme.colors.dark.muted,
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // Custom font for a modern look
      },
      spacing: {
        '128': '32rem',  // Large spacing utility for complex layouts
      },
    },
  },

  // Tailwind CSS Plugins
  plugins: [
    nextui(),
  ],
  // Enabling dark mode class strategy
  darkMode: 'class',

  // Custom variants for future use-cases
  variants: {
    extend: {
      // Extend utilities for states like 'hover', 'focus', etc.
      backgroundColor: ['active'],  // Active state background color
      opacity: ['disabled'],  // Opacity when the component is disabled
      cursor: ['disabled'],  // Cursor styling for disabled state
    },
  },
  // Future-proofing your configuration
  future: {
    // Remove deprecated gap utilities in future Tailwind releases
    removeDeprecatedGapUtilities: true,
  },
};
