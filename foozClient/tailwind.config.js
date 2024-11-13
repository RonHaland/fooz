/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    animation: {
      spin: "spin 0.8s infinite",
    },
    keyframes: {
      spin: {
        from: { rotate: "0deg" },
        to: { rotate: "360deg" },
      },
    },
  },
  plugins: [],
};
