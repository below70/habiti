import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {OnboardingStepProps} from '../../../types/onboarding';
import GlassButton from '../../GlassButton';
import GlassCard from '../../GlassCard';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
} from '../../../theme/liquidGlass';

const popularHabits = {
  build: [
    'Exercise daily',
    'Read books',
    'Meditate',
    'Drink 8 glasses of water',
    'Wake up early',
    'Practice gratitude',
    'Learn a new language',
    'Take vitamins',
  ],
  break: [
    'Stop smoking',
    'Reduce screen time',
    'No junk food',
    'Less social media',
    'Stop nail biting',
    'Reduce coffee intake',
    'No late night snacking',
    'Stop procrastinating',
  ],
  challenge: [
    '30-day fitness challenge',
    'No-sugar month',
    'Reading 12 books this year',
    'Mindfulness week',
    'Dry January',
    '10K steps daily',
    'No-buy month',
    'Digital detox week',
  ],
};

const frequencies = [
  {id: 'daily', label: 'Every day', description: 'Build consistency'},
  {id: 'weekly', label: 'Weekly', description: 'Flexible schedule'},
];

const durations = [
  {id: 7 as const, label: '1 week', description: 'Quick start'},
  {id: 14 as const, label: '2 weeks', description: 'Build momentum'},
  {id: 30 as const, label: '1 month', description: 'Form the habit'},
];

const DefineGoalStep: React.FC<OnboardingStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [habitName, setHabitName] = useState(data.habitName || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(
    data.frequency || 'daily',
  );
  const [weeklyTimes, setWeeklyTimes] = useState(data.weeklyTimes || 3);
  const [duration, setDuration] = useState<7 | 14 | 30>(data.duration || 30);
  const [startDate, setStartDate] = useState(
    data.startDate || new Date().toISOString().split('T')[0],
  );
  const [isPublic, setIsPublic] = useState(data.isPublic !== false);

  const goalType = data.goalType || 'build';
  const suggestions = popularHabits[goalType] || popularHabits.build;

  const handleContinue = () => {
    if (habitName.trim()) {
      onNext({
        habitName: habitName.trim(),
        frequency,
        weeklyTimes,
        duration,
        startDate,
        isPublic,
      });
    } else {
      Alert.alert('Please enter a habit name');
    }
  };

  const getGoalTypeText = () => {
    switch (goalType) {
      case 'build':
        return 'What habit do you want to build?';
      case 'break':
        return 'What habit do you want to break?';
      case 'challenge':
        return 'What challenge do you want to join?';
      default:
        return 'What habit do you want to work on?';
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

          <Text style={styles.title}>Define Your Goal</Text>
          <Text style={styles.subtitle}>{getGoalTypeText()}</Text>
        </View>

        {/* Habit Name Input */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Habit Name</Text>
          <TextInput
            style={styles.textInput}
            value={habitName}
            onChangeText={setHabitName}
            placeholder="Enter your habit..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />
        </GlassCard>

        {/* Popular Suggestions */}
        <GlassCard style={styles.suggestionsCard}>
          <Text style={styles.sectionTitle}>Popular Suggestions</Text>
          <View style={styles.suggestionsGrid}>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setHabitName(suggestion)}>
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Frequency Selection */}
        <GlassCard style={styles.frequencyCard}>
          <Text style={styles.sectionTitle}>How often?</Text>
          <View style={styles.frequencyOptions}>
            {frequencies.map(freq => (
              <TouchableOpacity
                key={freq.id}
                style={[
                  styles.frequencyOption,
                  frequency === freq.id && styles.selectedFrequency,
                ]}
                onPress={() => setFrequency(freq.id as 'daily' | 'weekly')}>
                <Text
                  style={[
                    styles.frequencyLabel,
                    frequency === freq.id && styles.selectedFrequencyText,
                  ]}>
                  {freq.label}
                </Text>
                <Text
                  style={[
                    styles.frequencyDescription,
                    frequency === freq.id && styles.selectedFrequencyText,
                  ]}>
                  {freq.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === 'weekly' && (
            <View style={styles.weeklyTimesContainer}>
              <Text style={styles.weeklyTimesLabel}>Times per week:</Text>
              <View style={styles.weeklyTimesOptions}>
                {[1, 2, 3, 4, 5, 6, 7].map(times => (
                  <TouchableOpacity
                    key={times}
                    style={[
                      styles.weeklyTimeOption,
                      weeklyTimes === times && styles.selectedWeeklyTime,
                    ]}
                    onPress={() => setWeeklyTimes(times)}>
                    <Text
                      style={[
                        styles.weeklyTimeText,
                        weeklyTimes === times && styles.selectedWeeklyTimeText,
                      ]}>
                      {times}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </GlassCard>

        {/* Duration Selection */}
        <GlassCard style={styles.durationCard}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationOptions}>
            {durations.map(dur => (
              <TouchableOpacity
                key={dur.id}
                style={[
                  styles.durationOption,
                  duration === dur.id && styles.selectedDuration,
                ]}
                onPress={() => setDuration(dur.id)}>
                <Text
                  style={[
                    styles.durationLabel,
                    duration === dur.id && styles.selectedDurationText,
                  ]}>
                  {dur.label}
                </Text>
                <Text
                  style={[
                    styles.durationDescription,
                    duration === dur.id && styles.selectedDurationText,
                  ]}>
                  {dur.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Privacy Setting */}
        <GlassCard style={styles.privacyCard}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.privacyToggle}
            onPress={() => setIsPublic(!isPublic)}>
            <View style={styles.privacyInfo}>
              <Text style={styles.privacyLabel}>
                {isPublic ? 'Public Challenge' : 'Private Goal'}
              </Text>
              <Text style={styles.privacyDescription}>
                {isPublic
                  ? 'Share with community for motivation'
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

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Continue"
            onPress={handleContinue}
            disabled={!habitName.trim()}
            variant="primary"
            size="large"
            style={[
              styles.continueButton,
              !habitName.trim() && styles.disabledButton,
            ]}
          />
        </View>
      </ScrollView>
    </View>
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
  inputCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  textInput: {
    fontSize: fontSizes.m,
    color: colors.textDark,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minHeight: 60,
  },
  suggestionsCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  suggestionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: borderRadius.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  suggestionText: {
    fontSize: fontSizes.s,
    color: colors.textDark,
    fontWeight: '500',
  },
  frequencyCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  frequencyOptions: {
    flexDirection: 'row',
    gap: spacing.m,
  },
  frequencyOption: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  frequencyLabel: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  frequencyDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
    textAlign: 'center',
  },
  selectedFrequencyText: {
    color: 'white',
  },
  weeklyTimesContainer: {
    marginTop: spacing.m,
    paddingTop: spacing.m,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
  weeklyTimesLabel: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  weeklyTimesOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  weeklyTimeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedWeeklyTime: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  weeklyTimeText: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.textDark,
  },
  selectedWeeklyTimeText: {
    color: 'white',
  },
  durationCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  durationOptions: {
    gap: spacing.s,
  },
  durationOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedDuration: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  durationLabel: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  durationDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
  },
  selectedDurationText: {
    color: 'white',
  },
  privacyCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
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
  continueButton: {
    width: '100%',
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default DefineGoalStep;
