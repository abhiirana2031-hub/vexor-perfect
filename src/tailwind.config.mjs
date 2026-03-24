/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1.25', letterSpacing: '0.02em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.375', letterSpacing: '0.03em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0.03em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.625', letterSpacing: '0.04em', fontWeight: '500' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '0.04em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '1.875', letterSpacing: '0.05em', fontWeight: '600' }],
                '3xl': ['1.875rem', { lineHeight: '2', letterSpacing: '0.05em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '2.25', letterSpacing: '0.06em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.06em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '0.07em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '0.07em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '0.08em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: ["syne"],
                paragraph: ["space grotesk"],
                "azeret-mono-black": ["azeret-mono-black", "azeret mono", "monospace"]
            },
            colors: {
                destructive: '#EF4444',
                'destructive-foreground': '#FFFFFF',
                'accent-teal': '#39FF14',
                'soft-shadow-gray': '#1E2A3A',
                background: '#0A192F',
                secondary: '#00BFFF',
                foreground: '#F0F0F0',
                'secondary-foreground': '#0A192F',
                'primary-foreground': '#FFFFFF',
                primary: '#0A192F'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
