const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'ttf', 'svg'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    extraNodeModules: {
      // This ensures @react-navigation assets are properly resolved
      '@react-navigation': path.resolve(
        __dirname,
        'node_modules/@react-navigation',
      ),
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

// First wrap with Reanimated config, then merge with default config
const reanimatedConfig = wrapWithReanimatedMetroConfig(config);
module.exports = mergeConfig(getDefaultConfig(__dirname), reanimatedConfig);
