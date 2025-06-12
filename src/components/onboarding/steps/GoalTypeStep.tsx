import React, {useState} from 'react';
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
} from 'react-native-reanimated';
import {OnboardingStepProps} from '../../../types/onboarding';
import GlassButton from '../../GlassButton';
import GlassCard from '../../GlassCard';
import {colors, spacing, fontSizes} from '../../../theme/liquidGlass';

interface GoalType {
  id: 'build' | 'break' | 'challenge';
  title: string;
  description: string;
  icon: string;
  examples: string[];
  color: string;
  bgColor: string;
}

const goalTypes: GoalType[] = [
  {
    id: 'build',
    title: 'Build a Habit',
    description: 'Start something new and make it stick',
    icon: '🌱',
    examples: [
      'Meditate daily',
      'Exercise',
      'Read 20 minutes',
      'Drink 2L water',
    ],
    color: colors.glassSuccess,
    bgColor: 'rgba(52, 199, 89, 0.1)',
  },
  {
    id: 'break',
    title: 'Break a Habit',
    description: "Overcome what's holding you back",
    icon: '🔥',
    examples: [
      'Quit smoking',
      'Less phone time',
      'No junk food',
      'Stop procrastinating',
    ],
    color: colors.glassError,
    bgColor: 'rgba(255, 59, 48, 0.1)',
  },
  {
    id: 'challenge',
    title: 'Join a Challenge',
    description: 'Team up with others for motivation',
    icon: '🏆',
    examples: [
      '30-day fitness',
      'No-sugar month',
      'Reading challenge',
      'Mindfulness week',
    ],
    color: colors.glassPrimary,
    bgColor: 'rgba(74, 144, 226, 0.1)',
  },
];

const GoalTypeStep: React.FC<OnboardingStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [selectedType, setSelectedType] = useState<
    'build' | 'break' | 'challenge' | null
  >(data.goalType || null);

  const handleContinue = () => {
    if (selectedType) {
      onNext({goalType: selectedType});
    }
  };

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

          <Text style={styles.title}>What's Your Goal?</Text>
          <Text style={styles.subtitle}>
            Choose the type of habit journey you want to start. Each path is
            designed to help you succeed.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {goalTypes.map((goalType, index) => (
            <GoalTypeCard
              key={goalType.id}
              goalType={goalType}
              isSelected={selectedType === goalType.id}
              onSelect={() => setSelectedType(goalType.id)}
              index={index}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedType}
            variant="primary"
            size="large"
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

interface GoalTypeCardProps {
  goalType: GoalType;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const GoalTypeCard: React.FC<GoalTypeCardProps> = ({
  goalType,
  isSelected,
  onSelect,
  index,
}) => {
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    opacity.value = withTiming(1, {duration: 600});
    scale.value = withSpring(1, {damping: 15, stiffness: 120});
  }, [index, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  const cardStyle = [
    styles.goalTypeCard,
    {backgroundColor: goalType.bgColor},
    isSelected && styles.selectedCard,
  ];

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={onSelect} activeOpacity={0.8}>
        <GlassCard style={cardStyle} hasPressAnimation={false}>
          <View style={styles.cardHeader}>
            <Text style={styles.goalIcon}>{goalType.icon}</Text>
            <View style={styles.titleContainer}>
              <Text style={styles.goalTitle}>{goalType.title}</Text>
              <Text style={styles.goalDescription}>{goalType.description}</Text>
            </View>
          </View>

          <View style={styles.examplesContainer}>
            <Text style={styles.examplesTitle}>Examples:</Text>
            <View style={styles.examplesList}>
              {goalType.examples.map((example, idx) => (
                <Text key={idx} style={styles.exampleText}>
                  • {example}
                </Text>
              ))}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
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
    marginBottom: spacing.m,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  backButtonText: {
    fontSize: fontSizes.m,
    color: colors.interactive,
    fontWeight: '500',
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: spacing.s,
  },
  subtitle: {
    fontSize: fontSizes.m,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: spacing.l,
  },
  goalTypeCard: {
    marginBottom: 0,
    padding: spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.interactive,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  goalIcon: {
    fontSize: fontSizes.xxl,
    marginRight: spacing.s,
  },
  titleContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: fontSizes.l,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  goalDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
    lineHeight: 18,
  },
  examplesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: spacing.s,
  },
  examplesTitle: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  examplesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  exampleText: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginRight: spacing.m,
    marginBottom: spacing.xs,
    width: '45%',
  },
  buttonContainer: {
    paddingHorizontal: spacing.m,
  },
  continueButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default GoalTypeStep;
