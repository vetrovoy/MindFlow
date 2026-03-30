// Custom resolver to handle ESM in react-native 0.84+

module.exports = (request, options) => {
  // Use default resolver
  return options.defaultResolver(request, {
    ...options,
    packageFilter: (pkg) => {
      // Force react-native and related packages to be treated as CommonJS
      if (pkg.name === 'react-native' || pkg.name?.startsWith('@react-native/')) {
        delete pkg.type;
      }
      return pkg;
    },
  });
};
