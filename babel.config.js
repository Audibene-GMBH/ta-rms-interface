module.exports = {
  "ignore": [
  ],
  presets: [[
      '@babel/preset-env',      {
          useBuiltIns: 'entry',
          corejs: 3,
          shippedProposals: true,
      },
  ],
],
};
