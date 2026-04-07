/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--sb-bg)",
        surface: "var(--sb-surface)",
        card: "var(--sb-card)",
        border: "var(--sb-border)",
        text: "var(--sb-text)",
        muted: "var(--sb-muted)",
        primary: {
          DEFAULT: "var(--sb-primary)",
          foreground: "var(--sb-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--sb-secondary)",
          foreground: "var(--sb-secondary-foreground)",
        },
        success: "var(--sb-success)",
        danger: "var(--sb-danger)",
        warning: "var(--sb-warning)",
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
