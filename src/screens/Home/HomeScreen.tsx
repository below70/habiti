import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import GlassCard from '../../components/GlassCard';
import GlassButton from '../../components/GlassButton';
import {colors, spacing} from '../../theme/liquidGlass';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const {width} = Dimensions.get('window');

// Custom animated metric card
const MetricCard = ({
  title,
  value,
  unit,
  color,
  delay = 0,
  onPress,
}: {
  title: string;
  value: string;
  unit: string;
  color: string;
  delay?: number;
  onPress?: () => void;
}) => {
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    opacity.value = withDelay(delay, withTiming(1, {duration: 500}));
    translateY.value = withDelay(delay, withSpring(0, {damping: 12}));

    // Subtle breathing animation
    scale.value = withDelay(
      delay + 500,
      withRepeat(
        withSequence(
          withTiming(1, {duration: 1500, easing: Easing.inOut(Easing.sin)}),
          withTiming(0.98, {duration: 1500, easing: Easing.inOut(Easing.sin)}),
        ),
        -1, // -1 means infinite repetition
        true, // reverse: true
      ),
    );
  }, [scale, translateY, opacity, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}, {translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  const handlePress = () => {
    if (onPress) {
      ReactNativeHapticFeedback.trigger('impactLight');
      onPress();
    }
  };

  return (
    <Animated.View style={[styles.metricCardContainer, animatedStyle]}>
      <GlassCard
        style={[styles.metricCard, {borderColor: color}]}
        hasPressAnimation={true}
        hasMountAnimation={false}
        onPress={handlePress}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={styles.metricValueContainer}>
          <Text style={styles.metricValue}>{value}</Text>
          <Text style={styles.metricUnit}>{unit}</Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

// Liquid bubble background element
const LiquidBubble = ({style, delay = 0}: {style?: any; delay?: number}) => {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Subtle floating movement
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-15, {duration: 2000, easing: Easing.inOut(Easing.sin)}),
          withTiming(15, {duration: 2000, easing: Easing.inOut(Easing.sin)}),
        ),
        -1,
        true,
      ),
    );

    // Subtle pulsing
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.1, {duration: 3000, easing: Easing.inOut(Easing.sin)}),
          withTiming(0.9, {duration: 3000, easing: Easing.inOut(Easing.sin)}),
        ),
        -1,
        true,
      ),
    );
  }, [translateY, scale, delay]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}, {scale: scale.value}],
    };
  });

  return <Animated.View style={[styles.bubble, style, animatedStyle]} />;
};

const HomeScreen = () => {
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-20);

  useEffect(() => {
    headerOpacity.value = withTiming(1, {duration: 800});
    headerTranslateY.value = withSpring(0, {damping: 15});
  }, [headerOpacity, headerTranslateY]);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{translateY: headerTranslateY.value}],
    };
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Background bubbles */}
      <LiquidBubble
        style={{
          top: '10%',
          right: '20%',
          width: width * 0.4,
          height: width * 0.4,
          backgroundColor: colors.glassPrimary,
          borderRadius: width * 0.2,
        }}
        delay={200}
      />
      <LiquidBubble
        style={{
          top: '40%',
          left: '-5%',
          width: width * 0.3,
          height: width * 0.3,
          backgroundColor: colors.glassAccent,
          borderRadius: width * 0.15,
        }}
        delay={600}
      />
      <LiquidBubble
        style={{
          bottom: '10%',
          right: '-10%',
          width: width * 0.5,
          height: width * 0.5,
          backgroundColor: colors.glassSuccess,
          borderRadius: width * 0.25,
        }}
        delay={400}
      />

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Your Habits Dashboard</Text>
        </Animated.View>

        <View style={styles.metricsContainer}>
          <MetricCard
            title="Current Streak"
            value="7"
            unit="days"
            color={colors.glassPrimary}
            delay={300}
          />
          <MetricCard
            title="Today's Progress"
            value="3/5"
            unit="habits"
            color={colors.glassAccent}
            delay={400}
          />
          <MetricCard
            title="Completion Rate"
            value="86"
            unit="%"
            color={colors.glassSuccess}
            delay={500}
          />
          <GlassCard style={styles.upcomingCard} hasMountAnimation={true}>
            <View style={styles.upcomingHeader}>
              <Text style={styles.upcomingTitle}>Upcoming Habits</Text>
              <GlassButton
                title="Add New"
                variant="secondary"
                size="small"
                onPress={() => {
                  ReactNativeHapticFeedback.trigger('impactLight');
                }}
              />
            </View>

            <View style={styles.habitList}>
              <Text style={styles.emptyStateText}>
                You have no habits scheduled for today. Add a new habit to get
                started!
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
    paddingHorizontal: spacing.l,
  },
  bubble: {
    position: 'absolute',
    zIndex: 1,
    opacity: 0.6,
  },
  header: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.s,
  },
  greeting: {
    fontSize: 18,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  metricsContainer: {
    marginBottom: spacing.l,
  },
  metricCardContainer: {
    marginBottom: spacing.l,
  },
  metricCard: {
    padding: spacing.m,
    borderLeftWidth: 4,
    borderColor: colors.glassPrimary,
  },
  metricTitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  metricUnit: {
    fontSize: 16,
    color: colors.textMuted,
    marginLeft: 5,
  },
  upcomingCard: {
    marginTop: spacing.l,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  upcomingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  habitList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyStateText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    maxWidth: '80%',
  },
});

export default HomeScreen;
