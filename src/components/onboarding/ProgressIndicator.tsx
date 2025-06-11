import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
} from '../../theme/liquidGlass';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(currentStep, [0, totalSteps], [0, 100], 'clamp');

    return {
      width: withSpring(`${width}%`, {
        damping: 15,
        stiffness: 120,
      }),
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.stepText}>
            Step {currentStep} of {totalSteps}
          </Text>
          <Text style={styles.progressText}>
            {Math.round(progress)}% complete
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: colors.glassLight,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.xl,
  },
  content: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.s,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  stepText: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
  },
  progressText: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.interactive,
  },
  progressTrack: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.pill,
    height: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.interactive,
    borderRadius: borderRadius.pill,
  },
});

export default ProgressIndicator;
