import React from 'react';
import {Text, StyleSheet, ViewStyle, TextStyle, Platform} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {colors, shadows, borderRadius, animations} from '../theme/liquidGlass';

interface GlassButtonProps {
  title: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  disabled = false,
}) => {
  // Animation values
  const pressed = useSharedValue(0);

  // Get variant properties
  const getVariantProperties = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.glassPrimary,
          textColor: colors.textLight,
        };
      case 'secondary':
        return {
          backgroundColor: colors.glassLight,
          textColor: colors.textDark,
        };
      case 'danger':
        return {
          backgroundColor: colors.glassError,
          textColor: colors.textLight,
        };
      default:
        return {
          backgroundColor: colors.glassPrimary,
          textColor: colors.textLight,
        };
    }
  };

  // Get size properties
  const getSizeProperties = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 14,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 16,
        };
    }
  };

  const variantProps = getVariantProperties();
  const sizeProps = getSizeProperties();

  // Function to trigger haptic feedback
  const triggerHaptic = () => {
    ReactNativeHapticFeedback.trigger('impactLight', {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };

  // Tap gesture handler
  const gesture = Gesture.Tap()
    .onBegin(() => {
      if (!disabled) {
        pressed.value = withSpring(1, animations.spring.responsive);
        runOnJS(triggerHaptic)();
      }
    })
    .onFinalize(() => {
      pressed.value = withSpring(0, animations.spring.responsive);
      if (!disabled && onPress) {
        runOnJS(onPress)();
      }
    });

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressed.value, [0, 1], [1, 0.95]);

    // Create a darker version of the background color for the pressed state
    const baseColor = variantProps.backgroundColor;
    const pressedColor = baseColor.startsWith('rgba')
      ? baseColor.replace(
          /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([^)]+)\)/,
          (_, r, g, b, a) => {
            return `rgba(${r}, ${g}, ${b}, ${parseFloat(a) * 0.8})`;
          },
        )
      : baseColor.startsWith('rgb')
      ? baseColor.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, (_, r, g, b) => {
          return `rgba(${r}, ${g}, ${b}, 0.8)`;
        })
      : baseColor; // Fallback to the original color if format isn't recognized

    return {
      transform: [{scale}],
      opacity: disabled ? 0.6 : 1,
      backgroundColor: disabled
        ? 'rgba(150, 150, 150, 0.6)'
        : interpolateColor(pressed.value, [0, 1], [baseColor, pressedColor]),
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.container,
          {
            paddingVertical: sizeProps.paddingVertical,
            paddingHorizontal: sizeProps.paddingHorizontal,
          },
          animatedContainerStyle,
          style,
        ]}>
        {Platform.OS === 'ios' && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={15}
            reducedTransparencyFallbackColor={variantProps.backgroundColor}
          />
        )}
        <Text
          style={[
            styles.text,
            {
              color: variantProps.textColor,
              fontSize: sizeProps.fontSize,
            },
            textStyle,
          ]}>
          {title}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.small,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GlassButton;
