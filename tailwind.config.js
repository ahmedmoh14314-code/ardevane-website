/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // The same palette as Ardevane Operations, so the guest site and the
      // staff dashboard look like one product
      colors: {
        brand: {
          50: "#eef5f1",
          100: "#d9ebe2",
          200: "#b2d6c6",
          300: "#7fb79d",
          400: "#4f9a79",
          500: "#2d8663",
          600: "#1e6b4f",
          700: "#185740",
          800: "#134432",
          900: "#0e3326",
          950: "#0a2219",
        },
        gold: {
          100: "#f6ecd9",
          200: "#ecd8b0",
          300: "#e3c589",
          500: "#c0995a",
          600: "#a97d3f",
          700: "#8a6532",
        },
        cream: {
          50: "#faf8f3",
          100: "#f0ece4",
          200: "#e3ddd1",
        },
        ink: {
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 0.4rem 1.6rem rgba(23, 43, 34, 0.06)",
        lift: "0 1.6rem 3.2rem rgba(23, 43, 34, 0.14)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(0.75rem)" },
          to: { opacity: "1", transform: "none" },
        },
        fade: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        fade: "fade 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
