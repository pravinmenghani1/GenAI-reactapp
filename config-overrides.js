module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    extensionAlias: {
      '.js': ['.js', '.ts', '.jsx', '.tsx']
    }
  };
  return config;
};

