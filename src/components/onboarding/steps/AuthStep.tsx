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
import auth from '@react-native-firebase/auth';
import {OnboardingStepProps} from '../../../types/onboarding';
import GlassButton from '../../GlassButton';
import GlassCard from '../../GlassCard';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
} from '../../../theme/liquidGlass';

const AuthStep: React.FC<OnboardingStepProps> = ({data, onNext, onBack}) => {
  const [mode, setMode] = useState<'choice' | 'signup' | 'signin'>('choice');
  const [formData, setFormData] = useState({
    name: data.name || '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Note: This would require proper Google Sign-In setup for React Native
      Alert.alert(
        'Coming Soon',
        'Google Sign-In will be available in the next update!',
      );

      // For now, continue with anonymous data
      onNext({
        name: formData.name || 'User',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await auth().createUserWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      // Update profile with name
      if (result.user && formData.name) {
        await result.user.updateProfile({
          displayName: formData.name,
        });
      }

      onNext({
        name: formData.name,
      });
    } catch (error: any) {
      let errorMessage = 'Failed to create account';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/weak-password':
          errorMessage = 'Please choose a stronger password';
          break;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async () => {
    setLoading(true);
    try {
      const result = await auth().signInWithEmailAndPassword(
        formData.email,
        formData.password,
      );

      onNext({
        name: result.user.displayName || formData.name || 'User',
      });
    } catch (error: any) {
      let errorMessage = 'Failed to sign in';

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onNext({
      name: 'Guest User',
    });
  };

  if (mode === 'choice') {
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

            <Text style={styles.title}>Almost There!</Text>
            <Text style={styles.subtitle}>
              Create an account to save your progress and sync across devices.
            </Text>
          </View>

          <GlassCard style={styles.optionCard}>
            <Text style={styles.cardTitle}>Sign up with Google</Text>
            <Text style={styles.cardDescription}>
              Quick and secure using your Google account
            </Text>
            <GlassButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              disabled={loading}
              variant="primary"
              size="large"
              style={styles.optionButton}
            />
          </GlassCard>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GlassCard style={styles.optionCard}>
            <Text style={styles.cardTitle}>Email & Password</Text>
            <Text style={styles.cardDescription}>
              Create a new account or sign in to existing one
            </Text>
            <View style={styles.emailOptions}>
              <GlassButton
                title="Sign Up"
                onPress={() => setMode('signup')}
                variant="primary"
                size="medium"
                style={styles.emailButton}
              />
              <GlassButton
                title="Sign In"
                onPress={() => setMode('signin')}
                variant="secondary"
                size="medium"
                style={styles.emailButton}
              />
            </View>
          </GlassCard>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const isSignUp = mode === 'signup';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMode('choice')}
            style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Enter your details to create your account'
              : 'Sign in to continue your journey'}
          </Text>
        </View>

        <GlassCard style={styles.formCard}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={formData.name}
                onChangeText={text =>
                  setFormData(prev => ({...prev, name: text}))
                }
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="words"
                textContentType="name"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={text =>
                setFormData(prev => ({...prev, email: text}))
              }
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                value={formData.password}
                onChangeText={text =>
                  setFormData(prev => ({...prev, password: text}))
                }
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                textContentType="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}>
                <Text style={styles.passwordToggleText}>
                  {showPassword ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.textInput}
                value={formData.confirmPassword}
                onChangeText={text =>
                  setFormData(prev => ({...prev, confirmPassword: text}))
                }
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                textContentType="password"
              />
            </View>
          )}

          <GlassButton
            title={
              loading
                ? 'Please wait...'
                : isSignUp
                ? 'Create Account'
                : 'Sign In'
            }
            onPress={isSignUp ? handleEmailSignUp : handleEmailSignIn}
            disabled={
              loading ||
              !formData.email ||
              !formData.password ||
              (isSignUp && !formData.name)
            }
            variant="primary"
            size="large"
            style={styles.submitButton}
          />

          <TouchableOpacity
            onPress={() => setMode(isSignUp ? 'signin' : 'signup')}
            style={styles.switchMode}>
            <Text style={styles.switchModeText}>
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Text>
          </TouchableOpacity>
        </GlassCard>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
  optionCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: fontSizes.l,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  cardDescription: {
    fontSize: fontSizes.s,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.m,
  },
  optionButton: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.m,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: spacing.m,
    fontSize: fontSizes.s,
    color: colors.textMuted,
  },
  emailOptions: {
    flexDirection: 'row',
    gap: spacing.s,
    width: '100%',
  },
  emailButton: {
    flex: 1,
  },
  formCard: {
    marginBottom: spacing.m,
    padding: spacing.l,
  },
  inputGroup: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    fontSize: fontSizes.s,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.s,
  },
  textInput: {
    fontSize: fontSizes.m,
    color: colors.textDark,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: borderRadius.medium,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing.m,
    top: spacing.m,
    padding: spacing.xs,
  },
  passwordToggleText: {
    fontSize: fontSizes.m,
  },
  submitButton: {
    width: '100%',
    marginTop: spacing.m,
  },
  switchMode: {
    marginTop: spacing.m,
    alignItems: 'center',
  },
  switchModeText: {
    fontSize: fontSizes.s,
    color: colors.interactive,
    fontWeight: '500',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  skipText: {
    fontSize: fontSizes.m,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

export default AuthStep;
