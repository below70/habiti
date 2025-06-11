import React, {useEffect, useCallback} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {TabParamList} from './types';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import {Text, View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import {colors, blurIntensity, shadows} from '../theme/liquidGlass';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const Tab = createBottomTabNavigator<TabParamList>();

// Custom tab bar item with glass effect and animations
const TabBarIcon = ({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: string;
  label: string;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  // Function to trigger haptic feedback safely from JS thread
  const triggerHaptic = useCallback(() => {
    ReactNativeHapticFeedback.trigger('impactLight');
  }, []);

  // Animate on mount
  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 400, // Stagger effect
      withTiming(1, {duration: 600}),
    );
  }, [opacity]);

  // Provide haptic feedback when tab changes
  useEffect(() => {
    if (focused) {
      // Safe to call directly in useEffect since we're on JS thread
      triggerHaptic();
      scale.value = withSpring(1.15, {damping: 12, stiffness: 200});
    } else {
      scale.value = withSpring(1, {damping: 12, stiffness: 200});
    }
  }, [focused, scale, triggerHaptic]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{scale: scale.value}],
    };
  });

  // Pre-compute styles to avoid inline style warnings
  const iconStyle = {
    fontSize: 22,
    marginBottom: 2,
    opacity: focused ? 1 : 0.7,
  };

  const labelStyle = {
    fontSize: 12,
    color: focused ? colors.interactive : colors.textMuted,
    fontWeight: focused ? '600' : ('400' as '600' | '400'),
  };

  return (
    <Animated.View style={[styles.tabItem, animatedStyle]}>
      <Text style={iconStyle}>{icon}</Text>
      <Text style={labelStyle}>{label}</Text>
    </Animated.View>
  );
};

// Custom tab bar with glass effect
const GlassTabBar = ({state, descriptors, navigation}: any) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={styles.tabBarContainer}>
      {/* Glass effect background */}
      {Platform.OS === 'ios' ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurIntensity.medium}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: colors.glassLight},
          ]}
        />
      )}

      {/* Top divider line with gradient */}
      <View style={styles.divider} />

      {/* Tab items */}
      <View style={styles.tabBarContent}>
        {state.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];
          const label = route.name;
          const isFocused = state.index === index;

          const icon = route.name === 'Home' ? '🏠' : '👤';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              style={styles.tabButton}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}>
              <TabBarIcon focused={isFocused} icon={icon} label={label} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Define tab bar renderer outside of any component
const renderTabBar = (props: any) => <GlassTabBar {...props} />;

// Define screen options outside of any component
const screenOptions = {
  headerShown: false,
};

// Navigator component
const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={renderTabBar} screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...shadows.medium,
  },
  tabBarContent: {
    flexDirection: 'row',
    height: '100%',
    paddingBottom: Platform.OS === 'ios' ? 20 : 0, // Account for iOS bottom safe area
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    width: '100%',
  },
});

export default TabNavigator;
