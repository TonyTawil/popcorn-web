/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: {
          DEFAULT: "#f97316", // Orange
          dark: "#ea580c",
          900: "#9a3412",
          600: "#ea580c",
        },
        "tv-primary": {
          DEFAULT: "#14b8a6", // Turquoise
          dark: "#0d9488",
          900: "#134e4a",
          600: "#0d9488",
        },
        accent: "var(--accent)",
        white: "var(--white)",
        black: "var(--black)",
      },
    },
  },
  plugins: [],
};
