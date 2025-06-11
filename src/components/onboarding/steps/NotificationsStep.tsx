import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
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

interface NotificationTone {
  id: 'supportive' | 'fun' | 'strict';
  title: string;
  description: string;
  examples: string[];
  color: string;
}

interface TimeSlot {
  time: string;
  label: string;
  icon: string;
}

const notificationTones: NotificationTone[] = [
  {
    id: 'supportive',
    title: 'Supportive',
    description: 'Gentle encouragement and positive reinforcement',
    examples: [
      "You've got this! Time for your daily habit.",
      "Small steps lead to big changes. Let's go!",
      'Your future self will thank you for this.',
    ],
    color: colors.glassSuccess,
  },
  {
    id: 'fun',
    title: 'Fun & Playful',
    description: 'Upbeat and energetic motivation',
    examples: [
      "🎉 Habit time! Let's make today awesome!",
      'Your streak is calling - answer it! 💪',
      'Time to level up your day! 🚀',
    ],
    color: colors.glassAccent,
  },
  {
    id: 'strict',
    title: 'Direct & Focused',
    description: 'Clear, no-nonsense reminders',
    examples: [
      'Time for your habit. No excuses.',
      'Consistency builds success. Take action now.',
      'Your commitment is calling. Deliver.',
    ],
    color: colors.glassDark,
  },
];

const timeSlots: TimeSlot[] = [
  {time: '06:00', label: 'Early Morning', icon: '🌅'},
  {time: '08:00', label: 'Morning', icon: '☀️'},
  {time: '12:00', label: 'Lunch Time', icon: '🕐'},
  {time: '18:00', label: 'Evening', icon: '🌆'},
  {time: '20:00', label: 'Night', icon: '🌙'},
];

const NotificationsStep: React.FC<OnboardingStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    data.notificationsEnabled !== false,
  );
  const [notificationTime, setNotificationTime] = useState(
    data.notificationTime || '08:00',
  );
  const [notificationTone, setNotificationTone] = useState<
    'supportive' | 'fun' | 'strict'
  >(data.notificationTone || 'supportive');

  const handleContinue = () => {
    onNext({
      notificationsEnabled,
      notificationTime: notificationsEnabled ? notificationTime : undefined,
      notificationTone: notificationsEnabled ? notificationTone : undefined,
    });
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'ios') {
      // For iOS, you would typically use @react-native-async-storage/async-storage
      // and react-native-push-notification or similar
      Alert.alert(
        'Notifications',
        'Notifications will help you stay on track with your habits. You can enable them in your device settings.',
        [{text: 'OK'}],
      );
    } else {
      // For Android
      Alert.alert(
        'Notifications',
        'Notifications will help you stay on track with your habits. You can enable them in your device settings.',
        [{text: 'OK'}],
      );
    }
  };

  const selectedTone = notificationTones.find(
    tone => tone.id === notificationTone,
  );

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

          <Text style={styles.title}>Stay on Track</Text>
          <Text style={styles.subtitle}>
            Set up reminders to help you build consistency with your new habit.
          </Text>
        </View>

        {/* Enable/Disable Notifications */}
        <GlassCard style={styles.enableCard}>
          <TouchableOpacity
            style={styles.enableToggle}
            onPress={() => {
              if (!notificationsEnabled) {
                requestNotificationPermission();
              }
              setNotificationsEnabled(!notificationsEnabled);
            }}>
            <View style={styles.enableInfo}>
              <Text style={styles.enableTitle}>
                {notificationsEnabled
                  ? '🔔 Notifications Enabled'
                  : '🔕 Notifications Disabled'}
              </Text>
              <Text style={styles.enableDescription}>
                {notificationsEnabled
                  ? "We'll send you gentle reminders"
                  : 'You can still track your progress manually'}
              </Text>
            </View>
            <View
              style={[
                styles.toggle,
                notificationsEnabled && styles.toggleActive,
              ]}>
              <View
                style={[
                  styles.toggleIndicator,
                  notificationsEnabled && styles.toggleIndicatorActive,
                ]}
              />
            </View>
          </TouchableOpacity>
        </GlassCard>

        {notificationsEnabled && (
          <>
            {/* Time Selection */}
            <GlassCard style={styles.timeCard}>
              <Text style={styles.sectionTitle}>
                When would you like to be reminded?
              </Text>
              <View style={styles.timeSlots}>
                {timeSlots.map(slot => (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      notificationTime === slot.time && styles.selectedTimeSlot,
                    ]}
                    onPress={() => setNotificationTime(slot.time)}>
                    <Text
                      style={[
                        styles.timeIcon,
                        notificationTime === slot.time &&
                          styles.selectedTimeText,
                      ]}>
                      {slot.icon}
                    </Text>
                    <Text
                      style={[
                        styles.timeLabel,
                        notificationTime === slot.time &&
                          styles.selectedTimeText,
                      ]}>
                      {slot.label}
                    </Text>
                    <Text
                      style={[
                        styles.timeValue,
                        notificationTime === slot.time &&
                          styles.selectedTimeText,
                      ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            {/* Tone Selection */}
            <GlassCard style={styles.toneCard}>
              <Text style={styles.sectionTitle}>
                Choose your motivation style
              </Text>
              <View style={styles.toneOptions}>
                {notificationTones.map(tone => (
                  <TouchableOpacity
                    key={tone.id}
                    style={[
                      styles.toneOption,
                      notificationTone === tone.id && styles.selectedToneOption,
                    ]}
                    onPress={() => setNotificationTone(tone.id)}>
                    <View style={styles.toneHeader}>
                      <Text
                        style={[
                          styles.toneTitle,
                          notificationTone === tone.id &&
                            styles.selectedToneText,
                        ]}>
                        {tone.title}
                      </Text>
                      {notificationTone === tone.id && (
                        <View style={styles.checkmark}>
                          <Text style={styles.checkmarkText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.toneDescription,
                        notificationTone === tone.id && styles.selectedToneText,
                      ]}>
                      {tone.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GlassCard>

            {/* Preview Examples */}
            {selectedTone && (
              <GlassCard
                style={[
                  styles.previewCard,
                  {backgroundColor: selectedTone.color + '20'},
                ]}>
                <Text style={styles.previewTitle}>Example Reminders:</Text>
                <View style={styles.previewExamples}>
                  {selectedTone.examples.map((example, index) => (
                    <View key={index} style={styles.exampleMessage}>
                      <Text style={styles.exampleText}>"{example}"</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            )}
          </>
        )}

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Continue"
            onPress={handleContinue}
            variant="primary"
            size="large"
            style={styles.continueButton}
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
  enableCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  enableToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enableInfo: {
    flex: 1,
  },
  enableTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  enableDescription: {
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
  timeCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  timeSlots: {
    gap: spacing.s,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedTimeSlot: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  timeIcon: {
    fontSize: fontSizes.l,
    marginRight: spacing.m,
  },
  timeLabel: {
    flex: 1,
    fontSize: fontSizes.m,
    fontWeight: '500',
    color: colors.textDark,
  },
  timeValue: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
  },
  selectedTimeText: {
    color: 'white',
  },
  toneCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  toneOptions: {
    gap: spacing.s,
  },
  toneOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedToneOption: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  toneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  toneTitle: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
  },
  toneDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
  },
  selectedToneText: {
    color: 'white',
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.interactive,
    fontSize: fontSizes.xs,
    fontWeight: 'bold',
  },
  previewCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
  },
  previewTitle: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  previewExamples: {
    gap: spacing.s,
  },
  exampleMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: borderRadius.small,
    padding: spacing.s,
  },
  exampleText: {
    fontSize: fontSizes.s,
    color: colors.textDark,
    fontStyle: 'italic',
  },
  buttonContainer: {
    paddingHorizontal: spacing.m,
  },
  continueButton: {
    width: '100%',
  },
});

export default NotificationsStep;
