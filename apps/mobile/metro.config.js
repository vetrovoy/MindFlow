const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '../..');

const workspacePackages = [
  '@mindflow/domain',
  '@mindflow/data',
  '@mindflow/ui',
  '@mindflow/copy',
];

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],
  resolver: {
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(root, 'node_modules'),
    ],
    resolveRequest: (context, moduleName, platform) => {
      // Resolve workspace packages to their source directories
      if (workspacePackages.includes(moduleName)) {
        const pkgName = moduleName.replace('@mindflow/', '');
        const pkgPath = path.resolve(
          root,
          'packages',
          pkgName,
          'src',
          'index.ts',
        );
        return {
          filePath: pkgPath,
          type: 'sourceFile',
        };
      }
      // Default resolution
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
