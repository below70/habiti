/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@react-native-firebase/app';

// Initialize Firebase JS SDK if needed
// This is optional as the native Firebase SDK is already
// initialized in AppDelegate.swift but ensures consistency

AppRegistry.registerComponent(appName, () => App);
