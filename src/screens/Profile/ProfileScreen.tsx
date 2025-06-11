import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types';
import GlassButton from '../../components/GlassButton';
import GlassCardFixed from '../../components/GlassCardFixed';
import {colors, spacing} from '../../theme/liquidGlass';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from 'react-native-reanimated';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainTabs'
>;

// Profile avatar component with liquid glass effect
const ProfileAvatar = () => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 80,
    });
    opacity.value = withTiming(1, {duration: 800});
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.avatarContainer, animatedStyle]}>
      <View style={styles.avatarInner}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
    </Animated.View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const contentOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(30);

  useEffect(() => {
    contentOpacity.value = withDelay(400, withTiming(1, {duration: 800}));
    contentTranslateY.value = withDelay(400, withSpring(0, {damping: 15}));
  }, [contentOpacity, contentTranslateY]);

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [{translateY: contentTranslateY.value}],
  }));

  const handleSignOut = async () => {
    try {
      const firebaseAuth = auth();
      await firebaseAuth.signOut();
      // Reset navigation stack and navigate to Onboarding
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Onboarding'}],
        }),
      );
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ProfileAvatar />

        <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
          <Text style={styles.username}>Guest User</Text>
          <Text style={styles.userStatus}>Anonymous Account</Text>

          <GlassCardFixed style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Your Stats</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Days Active</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Habits Created</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>0%</Text>
                <Text style={styles.statLabel}>Completion</Text>
              </View>
            </View>
          </GlassCardFixed>

          <GlassCardFixed style={styles.settingsCard}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <View style={styles.settingOption}>
              <Text style={styles.settingLabel}>Account Type</Text>
              <Text style={styles.settingValue}>Anonymous</Text>
            </View>

            <View style={styles.settingOption}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>Off</Text>
            </View>

            <View style={styles.settingOption}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Text style={styles.settingValue}>System Default</Text>
            </View>
          </GlassCardFixed>

          <View style={styles.buttonContainer}>
            <GlassButton
              title="Sign Out"
              variant="danger"
              size="large"
              onPress={handleSignOut}
              style={styles.signOutButton}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
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
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 100,
    paddingHorizontal: spacing.l,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.xl,
    backgroundColor: colors.glassLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: 50,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  userStatus: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  statsCard: {
    width: '100%',
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: spacing.m,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.s,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  settingsCard: {
    width: '100%',
    marginBottom: spacing.l,
  },
  settingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.s,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLabel: {
    fontSize: 16,
    color: colors.textDark,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textMuted,
  },
  buttonContainer: {
    width: '100%',
    marginTop: spacing.l,
    alignItems: 'center',
  },
  signOutButton: {
    width: '80%',
  },
});

export default ProfileScreen;
