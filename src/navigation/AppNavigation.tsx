import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import GlassTabNavigator from './GlassTabNavigator';
import auth from '@react-native-firebase/auth';
import {StyleSheet, View, Platform} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import '../utils/assets-transitioner'; // Import the asset transitioner
import {colors} from '../theme/liquidGlass';

const Stack = createStackNavigator<RootStackParamList>();

// Custom loading indicator with liquid glass animation
const LiquidLoadingIndicator = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Start animations
    opacity.value = withTiming(1, {duration: 500});
    scale.value = withSpring(1, {damping: 10, stiffness: 100});

    // Create a pulsating animation
    const pulseAnimation = () => {
      scale.value = withTiming(0.9, {duration: 1000}, () => {
        scale.value = withTiming(1.0, {duration: 1000}, pulseAnimation);
      });
    };

    // Create rotation animation
    const rotateAnimation = () => {
      rotation.value = withTiming(
        rotation.value + 360,
        {duration: 3000},
        rotateAnimation,
      );
    };

    pulseAnimation();
    rotateAnimation();

    return () => {
      // Cleanup is handled by Reanimated
    };
  }, [opacity, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}, {rotateZ: `${rotation.value}deg`}],
    };
  });

  return (
    <View style={styles.loadingContainer}>
      <Animated.View style={[styles.loadingBubble, animatedStyle]}>
        {Platform.OS === 'ios' && <View style={styles.loadingHighlight} />}
      </Animated.View>
      <Animated.View
        style={[
          styles.loadingBubble,
          styles.bubbleSmall,
          animatedStyle,
          {transform: [{scale: scale.value * 0.5}, {translateX: 30}]},
        ]}
      />
      <Animated.View
        style={[
          styles.loadingBubble,
          styles.bubbleSmall,
          animatedStyle,
          {
            transform: [
              {scale: scale.value * 0.7},
              {translateY: -20},
              {translateX: -25},
            ],
          },
        ]}
      />
    </View>
  );
};

const AppNavigation = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);
  const fadeAnim = useSharedValue(0);

  // Define the auth state change handler with proper typing
  const handleAuthStateChanged = (authUser: any) => {
    setUser(authUser);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    // Get the auth instance once and reuse it to avoid deprecation warnings
    const firebaseAuth = auth();
    const subscriber = firebaseAuth.onAuthStateChanged(handleAuthStateChanged);

    // Start fade-in animation
    fadeAnim.value = withDelay(300, withTiming(1, {duration: 800}));

    return subscriber; // unsubscribe on unmount
  }, [fadeAnim]);

  const screenAnimatedStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      opacity: fadeAnim.value,
    };
  });

  if (initializing) {
    return (
      <View style={styles.container}>
        <LiquidLoadingIndicator />
      </View>
    );
  }

  return (
    <Animated.View style={screenAnimatedStyle}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? 'MainTabs' : 'Onboarding'}
          screenOptions={{
            headerShown: false,
            cardStyle: {backgroundColor: 'transparent'},
            cardOverlayEnabled: true,
            cardStyleInterpolator: ({current}) => {
              // Using the animated value directly without interpolation
              const opacity = current.progress;

              return {
                cardStyle: {
                  opacity,
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                },
                overlayStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              };
            },
          }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="MainTabs" component={GlassTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glassPrimary,
    position: 'relative',
    overflow: 'hidden',
  },
  bubbleSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
  },
  loadingHighlight: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});

export default AppNavigation;
