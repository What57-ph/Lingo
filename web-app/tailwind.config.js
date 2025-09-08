/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // vi du mau
                brand: {
                    DEFAULT: "#1D4ED8",
                    light: "#3B82F6",
                    dark: "#1E40AF",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
