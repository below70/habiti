/**
 * Habiti App
 *
 * @format
 */

import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {enableScreens} from 'react-native-screens';

// Import Navigation
import AppNavigation from './src/navigation/AppNavigation';

// Enable screens for better native navigation performance
enableScreens();

// Ignore specific warnings that might be related to third-party dependencies
LogBox.ignoreLogs([
  'Sending `onAnimatedValueUpdate` with no listeners registered',
  '[react-native-gesture-handler]',
  'Non-serializable values were found in the navigation state',
]);

function App(): React.JSX.Element {
  useEffect(() => {
    // Register any global listeners or initializations here
    // This can help with ensuring Reanimated is properly initialized
    return () => {
      // Cleanup
    };
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
