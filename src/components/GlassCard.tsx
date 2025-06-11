import React, {useEffect} from 'react';
import {StyleSheet, View, ViewProps, Platform} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  shadows,
  colors,
  borderRadius,
  blurIntensity,
} from '../theme/liquidGlass';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

interface GlassCardProps extends ViewProps {
  blurIntensity?: number;
  borderRadius?: number;
  tintColor?: string;
  hasPressAnimation?: boolean;
  hasMountAnimation?: boolean;
  style?: any;
  children?: React.ReactNode;
  onPress?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  blurIntensity: blurAmount = blurIntensity.medium,
  borderRadius: borderRadiusValue = borderRadius.medium,
  tintColor = colors.glassLight,
  hasPressAnimation = true,
  hasMountAnimation = true,
  style,
  children,
  onPress,
  ...rest
}) => {
  // Animation values
  const scale = useSharedValue(hasMountAnimation ? 0.95 : 1);
  const opacity = useSharedValue(hasMountAnimation ? 0 : 1);
  const pressed = useSharedValue(0);

  // Mount animation
  useEffect(() => {
    if (hasMountAnimation) {
      opacity.value = withTiming(1, {duration: 500});
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 120,
      });
    }
  }, [hasMountAnimation, opacity, scale]);

  // Function to trigger haptic feedback
  const triggerHaptic = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  // Press gesture handler
  const gesture = Gesture.Tap()
    .onBegin(() => {
      if (hasPressAnimation) {
        pressed.value = withSpring(1, {damping: 20, stiffness: 300});
        runOnJS(triggerHaptic)();
      }
    })
    .onFinalize(() => {
      if (hasPressAnimation) {
        pressed.value = withSpring(0, {damping: 20, stiffness: 300});
        if (onPress) {
          runOnJS(onPress)();
        }
      }
    });

  // Dynamic styles based on animation values
  const animatedStyle = useAnimatedStyle(() => {
    const pressScale = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.97],
      Extrapolate.CLAMP,
    );

    const pressOpacity = interpolate(
      pressed.value,
      [0, 1],
      [1, 0.9],
      Extrapolate.CLAMP,
    );

    return {
      opacity: pressOpacity,
      transform: [{scale: scale.value * pressScale}],
      backgroundColor: `rgba(255, 255, 255, ${interpolate(
        pressed.value,
        [0, 1],
        [0.1, 0.2],
        Extrapolate.CLAMP,
      )})`,
      backfaceVisibility: 'hidden', // Reduces flickering on iOS
    };
  });

  const containerStyle = [
    styles.container,
    {
      borderRadius: borderRadiusValue,
      ...shadows.medium,
    },
    style,
  ];

  const contentContainerStyle = {
    borderRadius: borderRadiusValue,
    overflow: 'hidden' as 'hidden', // Type assertion
  };

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[containerStyle, animatedStyle]} {...rest}>
        <View style={contentContainerStyle}>
          {Platform.OS === 'ios' ? (
            <BlurView
              style={styles.blur}
              blurType="light"
              blurAmount={blurAmount}
              reducedTransparencyFallbackColor={tintColor}
            />
          ) : (
            // Fallback for Android
            <View style={[styles.blur, {backgroundColor: tintColor}]} />
          )}
          <View style={styles.highlight} />
          <View style={styles.content}>{children}</View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  blur: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: colors.highlight,
    opacity: 0.4,
    borderTopLeftRadius: borderRadius.medium,
    borderTopRightRadius: borderRadius.medium,
  },
  content: {
    padding: 16,
  },
});

export default GlassCard;
