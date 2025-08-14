/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)', opacity: '0.6' },
          '20%': { transform: 'translateX(100%) skewX(-15deg)', opacity: '0.6' },
          '100%': { transform: 'translateX(100%) skewX(-15deg)', opacity: '0' },
        },
      },
      animation: {
        'shine': 'shine 2s ease-in-out infinite',
      },
    },
    fontFamily: {
      sans: [
        'Inter',
        'Roboto',
        'Helvetica Neue',
        'Segoe UI',
        'Arial',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'sans-serif',
        'Orbitron',
      ],
      heading: ['Inter', 'sans-serif'],
      mono: [
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        'Liberation Mono',
        'Courier New',
        'monospace',
      ],
    },
    extend: {
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
      },
      fontSize: {
        // fine-tuned sizes for better mobile readability
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      colors: {
        active: "#FFC107",
        dullBlue: "#AECBF9",
        bgColor: "#000B18",
      },
backgroundImage: {
  whiteGradient: "linear-gradient(to bottom right, #ffffff, #f0f0f0)",
  blueGradient: "linear-gradient(to top, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
  blueHorizontalGradient: "linear-gradient(to left, #0A2472 0%, #0D47A1 45%, #1565C0 100%)",
  darkBlueGradient: "linear-gradient(to bottom, #021242, #0D34A7)",
  neonBlueGradient: "linear-gradient(to bottom right, #00cfff, #00b8ff, #007bff)",
  blueGradientAlt: "linear-gradient(to bottom right, #1565C0, #0D47A1, #0A2472)",
  communityGradient: "linear-gradient(to bottom, #1565C0 0%, #0D47A1 42%, #0A2472 100%)",

  // Exact colors from your uploaded gradient image
  deepRoyalGradient: "linear-gradient(to bottom, #0B33FF 0%, #000B33 100%)"
}
,
      animation: {
        'fade-in-out': 'fadeInOut 2s ease-in-out',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: '0' },
          '25%, 75%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
    addUtilities({
      '.font-robotItalic': {
        fontFamily: 'Orbitron, sans-serif',
        transform: 'skewX(-10deg)',
        letterSpacing: '-0.0090em',
        fontweight: '600',
      },
    });
  },
  ],
}