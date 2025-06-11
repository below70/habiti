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

const whyPrompts = [
  'I want to feel more confident and energetic',
  'I want to improve my health and wellbeing',
  'I want to be a better example for my family',
  'I want to achieve my personal goals',
  'I want to feel more productive and focused',
  'I want to reduce stress and anxiety',
  'I want to build better relationships',
  'I want to feel proud of my progress',
];

const motivationalQuotes = [
  'Your why is your anchor in the storm of temptation.',
  "When you know your why, you'll find your way.",
  'Purpose fuels persistence.',
  'Your reason is your strength.',
];

const WhyStep: React.FC<OnboardingStepProps> = ({data, onNext, onBack}) => {
  const [why, setWhy] = useState(data.why || '');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setWhy(prompt);
  };

  const handleContinue = () => {
    if (why.trim()) {
      onNext({why: why.trim()});
    } else {
      Alert.alert('Please tell us why this matters to you');
    }
  };

  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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

          <Text style={styles.title}>Why does this matter?</Text>
          <Text style={styles.subtitle}>
            Understanding your motivation will help you stay committed when
            things get tough.
          </Text>
        </View>

        {/* Motivational Quote */}
        <GlassCard style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>💡</Text>
          <Text style={styles.quote}>"{randomQuote}"</Text>
        </GlassCard>

        {/* Why Input */}
        <GlassCard style={styles.inputCard}>
          <Text style={styles.sectionTitle}>Your Personal Why</Text>
          <TextInput
            style={styles.textInput}
            value={why}
            onChangeText={setWhy}
            placeholder="I want to build this habit because..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.inputHint}>
            Be specific and personal. This will be your motivation when you need
            it most.
          </Text>
        </GlassCard>

        {/* Quick Prompts */}
        <GlassCard style={styles.promptsCard}>
          <Text style={styles.sectionTitle}>Need inspiration? Try these:</Text>
          <View style={styles.promptsContainer}>
            {whyPrompts.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.promptChip,
                  selectedPrompt === prompt && styles.selectedPrompt,
                ]}
                onPress={() => handlePromptSelect(prompt)}>
                <Text
                  style={[
                    styles.promptText,
                    selectedPrompt === prompt && styles.selectedPromptText,
                  ]}>
                  {prompt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Tips */}
        <GlassCard style={styles.tipsCard}>
          <Text style={styles.sectionTitle}>💭 Tips for a strong "why":</Text>
          <View style={styles.tipsList}>
            <TipItem text="Make it personal and emotional" />
            <TipItem text="Think about how you'll feel when you succeed" />
            <TipItem text="Consider the impact on people you care about" />
            <TipItem text="Focus on positive outcomes, not just problems" />
          </View>
        </GlassCard>

        <View style={styles.buttonContainer}>
          <GlassButton
            title="Continue"
            onPress={handleContinue}
            disabled={!why.trim()}
            variant="primary"
            size="large"
            style={[
              styles.continueButton,
              !why.trim() && styles.disabledButton,
            ]}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const TipItem: React.FC<{text: string}> = ({text}) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipBullet}>•</Text>
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

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
  quoteCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  quoteIcon: {
    fontSize: fontSizes.xxl,
    marginBottom: spacing.s,
  },
  quote: {
    fontSize: fontSizes.m,
    fontStyle: 'italic',
    color: colors.textDark,
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
    minHeight: 100,
    marginBottom: spacing.s,
  },
  inputHint: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  promptsCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  promptsContainer: {
    gap: spacing.s,
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedPrompt: {
    backgroundColor: colors.interactive,
    borderColor: colors.interactive,
  },
  promptText: {
    fontSize: fontSizes.s,
    color: colors.textDark,
    fontWeight: '500',
  },
  selectedPromptText: {
    color: 'white',
  },
  tipsCard: {
    marginBottom: spacing.l,
    padding: spacing.l,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  tipsList: {
    gap: spacing.s,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: fontSizes.m,
    color: colors.interactive,
    fontWeight: 'bold',
    marginRight: spacing.s,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: fontSizes.s,
    color: colors.textDark,
    lineHeight: 18,
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

export default WhyStep;
