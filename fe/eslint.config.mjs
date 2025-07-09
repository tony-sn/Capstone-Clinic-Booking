import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import tanstackQueryPlugin from "@tanstack/eslint-plugin-query";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["./fe/components/ui/**/*", "./fe/lib/actions/*"],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "standard",
    "plugin:tailwindcss/recommended",
    "prettier"
  ),
  {
    plugins: {
      import: importPlugin,
      "@tanstack/query": tanstackQueryPlugin,
    },
    rules: {
      "no-undef": "off",
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
      "@tanstack/query/exhaustive-deps": "error",
    },
  },
];

export default eslintConfig;
