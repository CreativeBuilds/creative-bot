let tryRequireFromStorage = path => {
  try {
    return require(path);
  } catch (err) {
    return {};
  }
};

module.exports = tryRequireFromStorage;
