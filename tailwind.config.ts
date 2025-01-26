import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // typography: {
      //   DEFAULT: {
      //     css: {
      //       fontFamily: 'inherit',
      //       '--tw-prose-body': 'inherit',
      //       '--tw-prose-headings': 'inherit',
      //       '--tw-prose-lead': 'inherit',
      //       '--tw-prose-links': 'inherit',
      //       '--tw-prose-bold': 'inherit',
      //       '--tw-prose-counters': 'inherit',
      //       '--tw-prose-bullets': 'inherit',
      //       '--tw-prose-hr': 'inherit',
      //       '--tw-prose-quotes': 'inherit',
      //       '--tw-prose-quote-borders': 'inherit',
      //       '--tw-prose-captions': 'inherit',
      //       '--tw-prose-code': 'inherit',
      //       '--tw-prose-pre-code': 'inherit',
      //       '--tw-prose-pre-bg': 'inherit',
      //       '--tw-prose-th-borders': 'inherit',
      //       '--tw-prose-td-borders': 'inherit',
      //     },
      //   },
      // },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
