import React, {useState, useEffect} from 'react';
import {View, StyleSheet, StatusBar, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigation/types';
import {OnboardingData, OnboardingFlowProps} from '../../types/onboarding';
import {colors} from '../../theme/liquidGlass';

// Import all step components
import ProgressIndicator from './ProgressIndicator';
import WelcomeScreen from './steps/WelcomeScreen';
import GoalTypeStep from './steps/GoalTypeStep';
import DefineGoalStep from './steps/DefineGoalStep';
import WhyStep from './steps/WhyStep';
import CoverMoodStep from './steps/CoverMoodStep';
import NotificationsStep from './steps/NotificationsStep';
import AuthStep from './steps/AuthStep';
import ConfirmationStep from './steps/ConfirmationStep';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type OnboardingNavigationProp = StackNavigationProp<RootStackParamList>;

const TOTAL_STEPS = 8;

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({onComplete}) => {
  const navigation = useNavigation<OnboardingNavigationProp>();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Load partial data from AsyncStorage on mount
  useEffect(() => {
    const loadPartialData = async () => {
      try {
        const saved = await AsyncStorage.getItem('habiti-onboarding');
        if (saved) {
          const {data: savedData, step, timestamp} = JSON.parse(saved);

          // Check if data is not too old (24 hours)
          const now = Date.now();
          const dayInMs = 24 * 60 * 60 * 1000;

          if (now - timestamp < dayInMs && savedData && step) {
            setData(savedData);
            setCurrentStep(step);
          }
        }
      } catch (error) {
        console.log('Error loading onboarding data:', error);
      }
    };

    loadPartialData();
  }, []);

  // Save partial data
  const savePartialData = async (
    newData: Partial<OnboardingData>,
    step: number,
  ) => {
    const updatedData = {...data, ...newData};
    setData(updatedData);

    try {
      // Save to AsyncStorage for all users
      await AsyncStorage.setItem(
        'habiti-onboarding',
        JSON.stringify({
          data: updatedData,
          step: step,
          timestamp: Date.now(),
        }),
      );

      // TODO: Save to Firestore if user is logged in
      // if (auth().currentUser) {
      //   await firestore()
      //     .collection('users')
      //     .doc(auth().currentUser.uid)
      //     .collection('onboarding')
      //     .doc('progress')
      //     .set({
      //       data: updatedData,
      //       step: step,
      //       updatedAt: firestore.FieldValue.serverTimestamp(),
      //     }, { merge: true });
      // }
    } catch (error) {
      console.log('Error saving onboarding data:', error);
    }
  };

  const handleNext = (stepData: Partial<OnboardingData>) => {
    const nextStep = currentStep + 1;
    savePartialData(stepData, nextStep);
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      savePartialData({}, prevStep);
    }
  };

  const handleComplete = async (finalData: Partial<OnboardingData>) => {
    setLoading(true);
    try {
      const completeData = {...data, ...finalData};

      // TODO: Save final data to Firestore
      // if (auth().currentUser) {
      //   await firestore()
      //     .collection('users')
      //     .doc(auth().currentUser.uid)
      //     .set({
      //       onboardingCompleted: true,
      //       habitData: completeData,
      //       createdAt: firestore.FieldValue.serverTimestamp(),
      //     }, { merge: true });
      // }

      // Clear onboarding data from AsyncStorage
      await AsyncStorage.removeItem('habiti-onboarding');

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete(completeData);
      }

      // Navigate to main app
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'MainTabs'}],
        }),
      );
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to save your data. Please try again.', [
        {text: 'OK'},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeScreen onNext={() => handleNext({})} />;
      case 2:
        return <AuthStep data={data} onNext={handleNext} onBack={handleBack} />;
      case 3:
        return (
          <GoalTypeStep data={data} onNext={handleNext} onBack={handleBack} />
        );
      case 4:
        return (
          <DefineGoalStep data={data} onNext={handleNext} onBack={handleBack} />
        );
      case 5:
        return <WhyStep data={data} onNext={handleNext} onBack={handleBack} />;
      case 6:
        return (
          <CoverMoodStep data={data} onNext={handleNext} onBack={handleBack} />
        );
      case 7:
        return (
          <NotificationsStep
            data={data}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 8:
        return (
          <ConfirmationStep
            data={data}
            onComplete={handleComplete}
            onBack={handleBack}
            loading={loading}
          />
        );
      default:
        return <WelcomeScreen onNext={() => handleNext({})} />;
    }
  };

  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.backgroundLight}
      />

      {currentStep > 1 && (
        <ProgressIndicator
          currentStep={currentStep - 1}
          totalSteps={TOTAL_STEPS - 1}
        />
      )}

      <View style={[styles.content, {paddingTop: insets.top}]}>
        {renderStep()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    flex: 1,
  },
});

export default OnboardingFlow;
