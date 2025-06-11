import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions, Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types';
import {BlurView} from '@react-native-community/blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import GlassButton from '../../components/GlassButton';
import GlassCard from '../../components/GlassCard';
import {colors, spacing} from '../../theme/liquidGlass';

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

// Abstract background shapes for visual interest
const BackgroundShape = ({style, delay = 0}: {style: any; delay?: number}) => {
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withSpring(-20, {damping: 6, stiffness: 40}),
    );
    opacity.value = withDelay(delay, withTiming(0.7, {duration: 1000}));
  }, [delay, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  return <Animated.View style={[styles.shape, style, animatedStyle]} />;
};

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(-20);
  const subtitleOpacity = useSharedValue(0);
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(0.9);

  // Staggered animations
  useEffect(() => {
    // Title animation
    titleOpacity.value = withDelay(300, withTiming(1, {duration: 800}));
    titleTranslateY.value = withDelay(300, withSpring(0, {damping: 15}));

    // Subtitle animation
    subtitleOpacity.value = withDelay(500, withTiming(1, {duration: 800}));

    // Card animation
    cardOpacity.value = withDelay(700, withTiming(1, {duration: 800}));
    cardScale.value = withDelay(
      700,
      withSpring(1, {damping: 12, stiffness: 100}),
    );
  }, [titleOpacity, titleTranslateY, subtitleOpacity, cardOpacity, cardScale]);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{translateY: titleTranslateY.value}],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{scale: cardScale.value}],
  }));

  // Using the modular Firebase API to fix the deprecation warning
  const handleAnonymousSignIn = async () => {
    try {
      const firebaseAuth = auth();
      await firebaseAuth.signInAnonymously();
      // Reset navigation stack to prevent going back after sign in
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainTabs'}],
        }),
      );
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Floating abstract shapes in background */}
      <BackgroundShape
        style={[
          styles.circle,
          {top: '10%', right: '15%', backgroundColor: colors.glassPrimary},
        ]}
        delay={200}
      />
      <BackgroundShape
        style={[
          styles.circle,
          {bottom: '30%', left: '10%', backgroundColor: colors.glassAccent},
        ]}
        delay={400}
      />
      <BackgroundShape
        style={[
          styles.roundedRect,
          {bottom: '15%', right: '5%', backgroundColor: colors.glassSuccess},
        ]}
        delay={600}
      />

      {/* Glass overlay effect */}
      {Platform.OS === 'ios' && (
        <BlurView style={styles.blurOverlay} blurType="light" blurAmount={10} />
      )}

      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.title, titleAnimatedStyle]}>
          Welcome to Habiti
        </Animated.Text>

        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
          Track and build better habits with a beautiful experience
        </Animated.Text>

        <Animated.View style={[{width: '100%'}, cardAnimatedStyle]}>
          <GlassCard style={styles.card} hasMountAnimation={false}>
            <Text style={styles.cardTitle}>Start Your Journey</Text>
            <Text style={styles.cardText}>
              Build better habits, track your progress, and achieve your goals
              with Habiti.
            </Text>

            <GlassButton
              title="Continue as Guest"
              onPress={handleAnonymousSignIn} // The GlassButton now correctly uses runOnJS internally
              variant="primary"
              size="large"
              style={styles.signInButton}
            />
          </GlassCard>
        </Animated.View>
      </View>
    </View>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.backgroundLight,
    position: 'relative',
    overflow: 'hidden',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    padding: spacing.l,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    marginBottom: spacing.m,
    color: colors.textDark,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: spacing.xl,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 300,
  },
  card: {
    paddingVertical: spacing.l,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.m,
    color: colors.textDark,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.textMuted,
    lineHeight: 22,
  },
  signInButton: {
    marginTop: spacing.m,
    width: '80%',
  },
  shape: {
    position: 'absolute',
    zIndex: 0,
  },
  circle: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
  },
  roundedRect: {
    width: width * 0.25,
    height: width * 0.35,
    borderRadius: 30,
  },
});

export default OnboardingScreen;
