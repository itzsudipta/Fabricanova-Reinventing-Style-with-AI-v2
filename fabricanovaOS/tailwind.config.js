/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./component/**/*.{js,ts,jsx,tsx,mdx}",  // Matches your folder
        "./components/**/*.{js,ts,jsx,tsx,mdx}", // Safety backup
        "./src/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                stone: {
                    50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1',
                    400: '#a8a29e', 500: '#78716c', 600: '#57534e', 800: '#292524',
                    900: '#1c1917', 950: '#0c0a09',
                },
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}