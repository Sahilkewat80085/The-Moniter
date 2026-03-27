/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f14",
        panel: "#121821",
        border: "#1f2a36",
        negative: "#ff4d4f",
        positive: "#00c853",
        warning: "#f5c542",
        info: "#3b82f6",
      },
    },
  },
  plugins: [],
};
