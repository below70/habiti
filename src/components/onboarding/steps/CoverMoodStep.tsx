import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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

interface Mood {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

interface Color {
  id: string;
  name: string;
  gradient: string;
}

const moods: Mood[] = [
  {
    id: 'energetic',
    label: 'Energetic',
    emoji: '⚡',
    color: '#FF9500',
  },
  {
    id: 'calm',
    label: 'Calm',
    emoji: '🌸',
    color: '#34C759',
  },
  {
    id: 'focused',
    label: 'Focused',
    emoji: '🎯',
    color: '#5856D6',
  },
  {
    id: 'powerful',
    label: 'Powerful',
    emoji: '💪',
    color: '#FF3B30',
  },
  {
    id: 'peaceful',
    label: 'Peaceful',
    emoji: '🕊️',
    color: '#30D158',
  },
  {
    id: 'creative',
    label: 'Creative',
    emoji: '🎨',
    color: '#BF5AF2',
  },
  {
    id: 'determined',
    label: 'Determined',
    emoji: '🔥',
    color: '#FF6347',
  },
  {
    id: 'joyful',
    label: 'Joyful',
    emoji: '😊',
    color: '#007AFF',
  },
];

const colorPalette: Color[] = [
  {id: 'indigo', name: 'Indigo', gradient: '#5856D6'},
  {id: 'purple', name: 'Purple', gradient: '#AF52DE'},
  {id: 'pink', name: 'Pink', gradient: '#FF2D92'},
  {id: 'red', name: 'Red', gradient: '#FF3B30'},
  {id: 'orange', name: 'Orange', gradient: '#FF9500'},
  {id: 'yellow', name: 'Yellow', gradient: '#FFCC02'},
  {id: 'green', name: 'Green', gradient: '#34C759'},
  {id: 'blue', name: 'Blue', gradient: '#007AFF'},
  {id: 'cyan', name: 'Cyan', gradient: '#5AC8FA'},
  {id: 'gray', name: 'Gray', gradient: '#8E8E93'},
];

const CoverMoodStep: React.FC<OnboardingStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [selectedMood, setSelectedMood] = useState(data.mood || '');
  const [selectedColor, setSelectedColor] = useState(data.color || 'indigo');

  const handleContinue = () => {
    onNext({
      mood: selectedMood,
      color: selectedColor,
    });
  };

  const selectedMoodData = moods.find(mood => mood.id === selectedMood);
  const selectedColorData = colorPalette.find(
    color => color.id === selectedColor,
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

          <Text style={styles.title}>Choose Your Vibe</Text>
          <Text style={styles.subtitle}>
            Select a mood and color that represent how you want to feel when
            working on this habit. This will personalize your experience.
          </Text>
        </View>

        {/* Preview Card */}
        {(selectedMood || selectedColor) && (
          <GlassCard
            style={[
              styles.previewCard,
              {
                backgroundColor:
                  selectedColorData?.gradient + '20' || colors.glassLight,
              },
            ]}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewContent}>
              {selectedMoodData && (
                <Text style={styles.previewEmoji}>
                  {selectedMoodData.emoji}
                </Text>
              )}
              <Text style={styles.previewText}>
                {data.habitName || 'Your Habit'}
              </Text>
              <View
                style={[
                  styles.previewColorBar,
                  {
                    backgroundColor:
                      selectedColorData?.gradient || colors.interactive,
                  },
                ]}
              />
            </View>
          </GlassCard>
        )}

        {/* Mood Selection */}
        <GlassCard style={styles.moodCard}>
          <Text style={styles.sectionTitle}>How do you want to feel?</Text>
          <View style={styles.moodGrid}>
            {moods.map(mood => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  selectedMood === mood.id && styles.selectedMoodOption,
                  {
                    borderColor:
                      selectedMood === mood.id
                        ? mood.color
                        : 'rgba(255, 255, 255, 0.3)',
                  },
                ]}
                onPress={() => setSelectedMood(mood.id)}>
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.id && {color: mood.color},
                  ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Color Selection */}
        <GlassCard style={styles.colorCard}>
          <Text style={styles.sectionTitle}>Pick your color theme</Text>
          <View style={styles.colorGrid}>
            {colorPalette.map(color => (
              <TouchableOpacity
                key={color.id}
                style={[
                  styles.colorOption,
                  selectedColor === color.id && styles.selectedColorOption,
                ]}
                onPress={() => setSelectedColor(color.id)}>
                <View
                  style={[
                    styles.colorCircle,
                    {backgroundColor: color.gradient},
                  ]}>
                  {selectedColor === color.id && (
                    <Text style={styles.colorCheckmark}>✓</Text>
                  )}
                </View>
                <Text style={styles.colorName}>{color.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Continue"
            onPress={handleContinue}
            disabled={!selectedMood || !selectedColor}
            variant="primary"
            size="large"
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const {width} = Dimensions.get('window');
const moodItemWidth =
  (width - spacing.m * 2 - spacing.l * 2 - spacing.m * 3) / 4;
const colorItemWidth =
  (width - spacing.m * 2 - spacing.l * 2 - spacing.s * 4) / 5;

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
    marginBottom: spacing.s,
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
  previewCard: {
    marginBottom: spacing.s,
    padding: spacing.l,
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: fontSizes.m,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  previewContent: {
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: fontSizes.xxl + 8,
    marginBottom: spacing.s,
  },
  previewText: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  previewColorBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
  },
  moodCard: {
    marginBottom: spacing.s,
    padding: spacing.l,
  },
  sectionTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.s,
  },
  moodOption: {
    width: moodItemWidth,
    aspectRatio: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  selectedMoodOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  moodEmoji: {
    fontSize: fontSizes.l + 4,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
  },
  colorCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.s,
  },
  colorOption: {
    width: colorItemWidth,
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  selectedColorOption: {
    // Add any additional styling for selected color
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  colorCheckmark: {
    color: 'white',
    fontSize: fontSizes.s,
    fontWeight: 'bold',
  },
  colorName: {
    fontSize: fontSizes.xs,
    color: colors.textDark,
    fontWeight: '500',
    textAlign: 'center',
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

export default CoverMoodStep;
