/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--sb-bg))",
        surface: "hsl(var(--sb-surface))",
        card: "hsl(var(--sb-card))",
        border: "hsl(var(--sb-border))",
        text: "hsl(var(--sb-text))",
        muted: "hsl(var(--sb-muted))",
        primary: {
          DEFAULT: "hsl(var(--sb-primary))",
          foreground: "hsl(var(--sb-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--sb-secondary))",
          foreground: "hsl(var(--sb-secondary-foreground))",
        },
        success: "hsl(var(--sb-success))",
        danger: "hsl(var(--sb-danger))",
        warning: "hsl(var(--sb-warning))",
      },
      borderRadius: {
        lg: "14px",
        md: "12px",
        sm: "10px",
      },
      boxShadow: {
        soft: "0 12px 40px rgba(0,0,0,0.16)",
        ring: "0 0 0 1px var(--sb-border)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
