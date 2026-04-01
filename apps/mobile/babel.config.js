module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@mindflow/domain': '../../packages/domain/src',
          '@mindflow/data': '../../packages/data/src',
          '@mindflow/ui': '../../packages/ui/src',
          '@mindflow/copy': '../../packages/copy/src',
          '@mobile': './src',
          '@shared': './src/shared',
          '@pages': './src/pages',
          '@features': './src/features',
          '@widgets': './src/widgets',
          '@app': './src/app',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};