export interface OnboardingData {
  name?: string;
  profilePhoto?: string;
  goalType?: 'build' | 'break' | 'challenge';
  habitName?: string;
  frequency?: 'daily' | 'weekly';
  weeklyTimes?: number;
  startDate?: string;
  duration?: 7 | 14 | 30;
  reminderTime?: string;
  isPublic?: boolean;
  why?: string;
  mood?: string;
  color?: string;
  backgroundImage?: string;
  notificationsEnabled?: boolean;
  notificationTime?: string;
  notificationTone?: 'supportive' | 'fun' | 'strict';
}

export interface OnboardingStepProps {
  data: OnboardingData;
  onNext: (data: Partial<OnboardingData>) => void;
  onBack: () => void;
}

export interface OnboardingFlowProps {
  onComplete?: (data: OnboardingData) => void;
}
