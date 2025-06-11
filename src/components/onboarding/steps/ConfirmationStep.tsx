import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import {OnboardingData} from '../../../types/onboarding';
import GlassButton from '../../GlassButton';
import GlassCard from '../../GlassCard';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
} from '../../../theme/liquidGlass';

interface ConfirmationStepProps {
  data: OnboardingData;
  onComplete: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
  loading: boolean;
}

const motivationalMessages = [
  "Every expert was once a beginner. You're on your way!",
  'The best time to plant a tree was 20 years ago. The second best time is now.',
  'Small daily improvements lead to stunning results over time.',
  'Your future self is counting on the choices you make today.',
  'Success is the sum of small efforts repeated day in and day out.',
];

const achievements = [
  {
    icon: '🎯',
    title: 'Goal Setter',
    description: 'Defined a clear, actionable habit',
  },
  {
    icon: '💪',
    title: 'Motivated',
    description: 'Identified your personal why',
  },
  {
    icon: '🎨',
    title: 'Personalized',
    description: 'Made your habit uniquely yours',
  },
  {
    icon: '🔔',
    title: 'Prepared',
    description: 'Set up success reminders',
  },
];

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  data,
  onComplete,
  onBack,
  loading,
}) => {
  const [isPublic, setIsPublic] = useState(data.isPublic !== false);

  // Animation values
  const celebrationScale = useSharedValue(0);
  const celebrationOpacity = useSharedValue(0);
  const summaryOpacity = useSharedValue(0);
  const summaryY = useSharedValue(30);
  const achievementsOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    // Celebration animation
    celebrationScale.value = withDelay(
      200,
      withSpring(1, {damping: 15, stiffness: 200}),
    );
    celebrationOpacity.value = withDelay(200, withTiming(1, {duration: 600}));

    // Summary animation
    summaryOpacity.value = withDelay(600, withTiming(1, {duration: 600}));
    summaryY.value = withDelay(600, withSpring(0, {damping: 15}));

    // Achievements animation
    achievementsOpacity.value = withDelay(1000, withTiming(1, {duration: 600}));

    // Button animation
    buttonOpacity.value = withDelay(1400, withTiming(1, {duration: 600}));
  }, [
    celebrationScale,
    celebrationOpacity,
    summaryOpacity,
    summaryY,
    achievementsOpacity,
    buttonOpacity,
  ]);

  const handleComplete = () => {
    onComplete({isPublic});
  };

  const randomMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  const getStartDate = () => {
    if (data.startDate) {
      const date = new Date(data.startDate);
      return date.toLocaleDateString();
    }
    return 'Today';
  };

  const getGoalTypeText = () => {
    switch (data.goalType) {
      case 'build':
        return 'Building';
      case 'break':
        return 'Breaking';
      case 'challenge':
        return 'Challenge';
      default:
        return 'Working on';
    }
  };

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: celebrationScale.value}],
    opacity: celebrationOpacity.value,
  }));

  const summaryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: summaryOpacity.value,
    transform: [{translateY: summaryY.value}],
  }));

  const achievementsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: achievementsOpacity.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Celebration */}
        <Animated.View
          style={[styles.celebrationContainer, celebrationAnimatedStyle]}>
          <Text style={styles.celebrationEmoji}>🎉</Text>
          <Text style={styles.celebrationTitle}>You're All Set!</Text>
          <Text style={styles.celebrationSubtitle}>
            Your habit journey is about to begin
          </Text>
        </Animated.View>

        {/* Motivational Quote */}
        <Animated.View style={summaryAnimatedStyle}>
          <GlassCard style={styles.quoteCard}>
            <Text style={styles.quoteIcon}>✨</Text>
            <Text style={styles.quote}>"{randomMessage}"</Text>
          </GlassCard>
        </Animated.View>

        {/* Habit Summary */}
        <Animated.View style={summaryAnimatedStyle}>
          <GlassCard style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Habit Summary</Text>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Goal:</Text>
              <Text style={styles.summaryValue}>
                {getGoalTypeText()} "{data.habitName}"
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Frequency:</Text>
              <Text style={styles.summaryValue}>
                {data.frequency === 'daily'
                  ? 'Every day'
                  : `${data.weeklyTimes} times per week`}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>
                {data.duration === 7
                  ? '1 week'
                  : data.duration === 14
                  ? '2 weeks'
                  : '1 month'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Starting:</Text>
              <Text style={styles.summaryValue}>{getStartDate()}</Text>
            </View>

            {data.notificationsEnabled && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Reminders:</Text>
                <Text style={styles.summaryValue}>
                  {data.notificationTime} ({data.notificationTone})
                </Text>
              </View>
            )}

            {data.why && (
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Your Why:</Text>
                <Text style={styles.summaryValue}>"{data.why}"</Text>
              </View>
            )}
          </GlassCard>
        </Animated.View>

        {/* Achievements */}
        <Animated.View style={achievementsAnimatedStyle}>
          <GlassCard style={styles.achievementsCard}>
            <Text style={styles.achievementsTitle}>You've Earned These!</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <AchievementItem
                  key={index}
                  achievement={achievement}
                  index={index}
                />
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Privacy Setting */}
        <Animated.View style={achievementsAnimatedStyle}>
          <GlassCard style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>Share Your Journey</Text>
            <TouchableOpacity
              style={styles.privacyToggle}
              onPress={() => setIsPublic(!isPublic)}>
              <View style={styles.privacyInfo}>
                <Text style={styles.privacyLabel}>
                  {isPublic ? 'Public Challenge' : 'Private Goal'}
                </Text>
                <Text style={styles.privacyDescription}>
                  {isPublic
                    ? 'Share with community for extra motivation'
                    : 'Keep your progress private'}
                </Text>
              </View>
              <View style={[styles.toggle, isPublic && styles.toggleActive]}>
                <View
                  style={[
                    styles.toggleIndicator,
                    isPublic && styles.toggleIndicatorActive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Complete Button */}
        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <GlassButton
            title={loading ? 'Setting up your habit...' : 'Start My Journey!'}
            onPress={handleComplete}
            disabled={loading}
            variant="primary"
            size="large"
            style={styles.completeButton}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

interface AchievementItemProps {
  achievement: (typeof achievements)[0];
  index: number;
}

const AchievementItem: React.FC<AchievementItemProps> = ({
  achievement,
  index,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = 1200 + index * 100;
    scale.value = withDelay(
      delay,
      withSpring(1, {damping: 15, stiffness: 200}),
    );
    opacity.value = withDelay(delay, withTiming(1, {duration: 400}));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.achievementItem, animatedStyle]}>
      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
      <View style={styles.achievementContent}>
        <Text style={styles.achievementTitle}>{achievement.title}</Text>
        <Text style={styles.achievementDescription}>
          {achievement.description}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.xl,
  },
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.l,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
  },
  backButtonText: {
    fontSize: fontSizes.m,
    color: colors.interactive,
    fontWeight: '500',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
  },
  celebrationEmoji: {
    fontSize: 60,
    marginBottom: spacing.m,
  },
  celebrationTitle: {
    fontSize: fontSizes.xxl + 4,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  celebrationSubtitle: {
    fontSize: fontSizes.l,
    color: colors.textMuted,
    textAlign: 'center',
  },
  quoteCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  quoteIcon: {
    fontSize: fontSizes.l,
    marginBottom: spacing.s,
  },
  quote: {
    fontSize: fontSizes.m,
    fontStyle: 'italic',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  summaryCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  summaryTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    marginBottom: spacing.s,
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.textMuted,
    width: 80,
    marginRight: spacing.s,
  },
  summaryValue: {
    flex: 1,
    fontSize: fontSizes.s,
    color: colors.textDark,
    lineHeight: 18,
  },
  achievementsCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  achievementsTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  achievementsList: {
    gap: spacing.s,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
  },
  achievementIcon: {
    fontSize: fontSizes.l,
    marginRight: spacing.m,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
  },
  privacyCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
  },
  privacyTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyLabel: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  privacyDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  toggleIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleIndicatorActive: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    paddingHorizontal: spacing.m,
  },
  completeButton: {
    width: '100%',
  },
});

export default ConfirmationStep;
