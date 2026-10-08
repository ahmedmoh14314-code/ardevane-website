/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // The same palette as Ardevane Operations, so the guest site and the
      // staff dashboard look like one product
      colors: {
        // The Ardevane identity: warm sand paper, deep forest ink, and the
        // bark brown of the cabins
        sand: {
          50: "#faf6ef",
          100: "#f4ede2",
          200: "#ebe2d3",
          300: "#ddd0bb",
        },
        forest: {
          700: "#2f3d35",
          800: "#232e28",
          900: "#1b241f",
          950: "#131a16",
        },
        bark: {
          400: "#b98a5c",
          500: "#9c6c3f",
          600: "#835631",
          700: "#6b4427",
        },
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
          50: "#faf6ef",
          100: "#f4ede2",
          200: "#ebe2d3",
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
        sans: ["var(--font-body)", "Georgia", "serif"],
        label: ["var(--font-label)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
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
        // A highlight that crosses a badge now and then
        shine: {
          "0%, 70%": { transform: "translateX(0) skewX(-12deg)" },
          "100%": { transform: "translateX(500%) skewX(-12deg)" },
        },
      },
      animation: {
        rise: "rise 0.5s ease-out both",
        fade: "fade 0.4s ease-out both",
        shine: "shine 3.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
