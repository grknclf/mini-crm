module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // Geliştirme konforu: kullanılmayan parametrelerde _ prefix'i serbest
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // Projede sık görülen pattern’lerde gürültüyü azaltır
    'no-console': 'off',
  },
};
