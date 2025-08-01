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
    ignores: [
      "./fe/components/ui/**/*",
      "./fe/lib/actions/*",
      "./fe/.next/**/*",
      "node_modules/**/*",
      "./fe/node_modules/**/*",
    ],
  },
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "plugin:tailwindcss/recommended",
    "prettier",
  ),
  {
    settings: {
      next: {
        rootDir: "./fe/",
      },
    },
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
      "tailwindcss/no-custom-classname": "off",
      "@tanstack/query/exhaustive-deps": "error",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

export default eslintConfig;
