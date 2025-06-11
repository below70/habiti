// This file helps with asset resolution in React Navigation
export default {
  // This custom resolver helps with asset loading when Metro bundler
  // has issues with React Navigation assets
  resolveAssetSource: asset => {
    if (typeof asset === 'number') {
      return asset;
    }
    return asset;
  },
};
