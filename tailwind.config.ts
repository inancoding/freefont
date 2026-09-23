import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/client/**/*.{vue,ts,html}',
    './src/admin/**/*.{vue,ts,html}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
