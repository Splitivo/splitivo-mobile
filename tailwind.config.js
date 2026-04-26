/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: "var(--color-accent-primary)",
          pressed: "var(--color-accent-pressed)",
          secondary: "var(--color-accent-secondary)",
        },
      },
      borderRadius: {
        card: "16px",
      },
    },
  },
  plugins: [],
};
