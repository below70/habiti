/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

// Import Firebase Auth and App
import firebase from '@react-native-firebase/app';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Check if Firebase is initialized
  useEffect(() => {
    const apps = firebase.apps;
    console.log('Firebase apps initialized:', apps.length);
    apps.forEach(app => console.log('Firebase app name:', app.name));
  }, []);

  useEffect(() => {
    // Handle user state changes
    const onAuthStateChanged = (
      authUser: FirebaseAuthTypes.User | null,
    ): void => {
      setUser(authUser);
      if (initializing) {
        setInitializing(false);
      }
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [initializing]);

  // Sign in anonymously
  const signInAnonymously = async (): Promise<void> => {
    try {
      const userCredential = await auth().signInAnonymously();
      console.log(
        'User signed in anonymously with UID:',
        userCredential.user.uid,
      );
      Alert.alert(
        'Success',
        `Signed in anonymously with UID: ${userCredential.user.uid}`,
      );
    } catch (error: any) {
      console.error('Anonymous sign-in error:', error);
      Alert.alert('Error', `Failed to sign in: ${error.message}`);
    }
  };

  // Sign out
  const signOut = async (): Promise<void> => {
    try {
      await auth().signOut();
      console.log('User signed out');
      Alert.alert('Success', 'Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      Alert.alert('Error', `Failed to sign out: ${error.message}`);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // Show loading state while initializing
  if (initializing) {
    return (
      <View style={[styles.centerContainer, backgroundStyle]}>
        <Text>Initializing Firebase...</Text>
      </View>
    );
  }

  /*
   * To keep the template simple and small we're adding padding to prevent view
   * from rendering under the System UI.
   * For bigger apps the recommendation is to use `react-native-safe-area-context`:
   * https://github.com/AppAndFlow/react-native-safe-area-context
   *
   * You can read more about it here:
   * https://github.com/react-native-community/discussions-and-proposals/discussions/827
   */
  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView style={backgroundStyle}>
        <View style={{paddingRight: safePadding}}>
          <Header />
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          {/* Firebase Authentication Test Section */}
          <Section title="Firebase Authentication Test">
            {user ? (
              <View>
                <Text style={styles.firebaseText}>
                  Signed in anonymously as: {user.uid}
                </Text>
                <Button title="Sign Out" onPress={signOut} color="#FF3B30" />
              </View>
            ) : (
              <Button
                title="Sign In Anonymously"
                onPress={signInAnonymously}
                color="#007AFF"
              />
            )}
          </Section>

          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  firebaseText: {
    marginBottom: 10,
  },
});

export default App;
