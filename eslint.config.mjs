import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const jsxA11y = nextVitals.find((config) => config.plugins?.["jsx-a11y"])?.plugins?.["jsx-a11y"];

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  { files: ["**/*.{jsx,tsx}"], rules: jsxA11y.configs.recommended.rules },
  globalIgnores([".next/**", "out/**", "next-env.d.ts"]),
]);
