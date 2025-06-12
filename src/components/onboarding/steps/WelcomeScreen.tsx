import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import GlassButton from '../../GlassButton';
import {colors, spacing, fontSizes} from '../../../theme/liquidGlass';

interface WelcomeScreenProps {
  onNext: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({onNext}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const featuresOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered animations
    logoScale.value = withDelay(
      300,
      withSpring(1, {damping: 15, stiffness: 200}),
    );

    titleOpacity.value = withDelay(600, withTiming(1, {duration: 800}));
    titleY.value = withDelay(600, withSpring(0, {damping: 15}));

    subtitleOpacity.value = withDelay(800, withTiming(1, {duration: 600}));
    featuresOpacity.value = withDelay(1000, withTiming(1, {duration: 600}));
    buttonOpacity.value = withDelay(1200, withTiming(1, {duration: 600}));
  }, [
    logoScale,
    titleOpacity,
    titleY,
    subtitleOpacity,
    featuresOpacity,
    buttonOpacity,
  ]);

  const handleGetStarted = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onNext();
    }, 300);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: logoScale.value}],
  }));

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleY.value}],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const featuresAnimatedStyle = useAnimatedStyle(() => ({
    opacity: featuresOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🌟</Text>
        </View>
      </Animated.View>

      <Animated.View style={titleAnimatedStyle}>
        <Text style={styles.title}>
          Ready to <Text style={styles.titleHighlight}>build a habit</Text> or{' '}
          <Text style={styles.titleBreak}>break one?</Text>
        </Text>
      </Animated.View>

      <Animated.View style={subtitleAnimatedStyle}>
        <Text style={styles.subtitle}>
          Turn your goal into a public challenge and stay accountable.
        </Text>
      </Animated.View>

      <Animated.View style={[styles.featuresContainer, featuresAnimatedStyle]}>
        <FeatureItem icon="🌟" text="Join public challenges" />
        <FeatureItem icon="📈" text="Track your progress & stay motivated" />
        <FeatureItem icon="🤝" text="Build accountability together" />
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
        <GlassButton
          title={isAnimating ? 'Getting Started...' : 'Get Started'}
          onPress={handleGetStarted}
          disabled={isAnimating}
          variant="primary"
          size="large"
          style={styles.getStartedButton}
        />

        <Text style={styles.disclaimerText}>
          Takes just 60 seconds to set up
        </Text>
      </Animated.View>
    </View>
  );
};

const FeatureItem: React.FC<{icon: string; text: string}> = ({icon, text}) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: colors.backgroundLight,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glassLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: fontSizes.xxxl + 8,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.m,
    color: colors.textDark,
    lineHeight: fontSizes.xxxl + 12,
  },
  titleHighlight: {
    color: colors.interactive,
  },
  titleBreak: {
    color: colors.glassError,
  },
  subtitle: {
    fontSize: fontSizes.l,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textMuted,
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  featuresContainer: {
    marginBottom: spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    paddingHorizontal: spacing.m,
  },
  featureIcon: {
    fontSize: fontSizes.l,
    marginRight: spacing.m,
  },
  featureText: {
    fontSize: fontSizes.m,
    color: colors.textDark,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    width: '100%',
    marginBottom: spacing.m,
  },
  disclaimerText: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default WelcomeScreen;
