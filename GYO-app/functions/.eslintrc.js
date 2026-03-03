module.exports = {
  env: {
    es6: true,
    node: true, // Autorise les variables globales Node.js
  },
  parserOptions: {
    "ecmaVersion": 2018,
  },
  extends: [
    "eslint:recommended",
    // "google", // Je te conseille de commenter cette ligne si le déploiement échoue encore
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {"allowTemplateLiterals": true}],
    "no-unused-vars": "warn", // Évite que des variables non utilisées bloquent le déploiement
    "indent": "off", // Évite les erreurs d'espacement souvent pénibles
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    "module": "writable",
    "require": "readonly",
    "exports": "writable",
    "process": "readonly",
  },
};