import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "out/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "persona-results/**",
      "reports/**",
      "review-packets/**",
      "repo-reviews/**",
      "chatgpt-zip-packets/**",
    ],
  },
  ...nextVitals,
];

export default config;
