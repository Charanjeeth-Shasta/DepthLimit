/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#F8F9FB",
        "bg-surface": "#FFFFFF",
        "bg-elevated": "#EEF0F5",
        "bg-border": "#DDE1EA",
        "accent-teal": "#0D9488",
        "accent-teal-bright": "#14B8A6",
        "accent-blue": "#2563EB",
        "accent-blue-bright": "#3B82F6",
        "text-primary": "#0F172A",
        "text-secondary": "#475569",
        "text-tertiary": "#94A3B8",
        success: "#059669",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fillBar: {
          "0%": { width: "0%" },
          "100%": { width: "var(--bar-width)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 400ms ease-out forwards",
        skeleton: "pulse 1.5s ease-in-out infinite",
        fillBar: "fillBar 800ms ease-out forwards",
      },
    },
  },
  plugins: [],
};