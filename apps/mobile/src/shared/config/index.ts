import { Platform } from 'react-native';

/**
 * Default API port from the server app.
 */
const DEFAULT_API_PORT = 3000;

/**
 * Backend API URL configuration.
 *
 * In Development:
 * - Android emulator: uses 10.0.2.2 to access host's localhost.
 * - iOS simulator: uses localhost.
 * - Physical device: should ideally use your machine's local IP (e.g., 192.168.1.x),
 *   but defaults to localhost for simplicity.
 *
 * In Production:
 * - Replace with your actual production API URL.
 */
const getApiBaseUrl = (): string | null => {
  if (__DEV__) {
    // For Android emulator, localhost is the emulator itself.
    // 10.0.2.2 is a special alias to the host loopback interface.
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${DEFAULT_API_PORT}`;
    }

    // iOS Simulator or local dev
    return `http://localhost:${DEFAULT_API_PORT}`;
  }

  // Production URL (to be replaced with env variables or production config)
  return 'https://api.mindflow.app';
};

export const API_BASE_URL = getApiBaseUrl();

export const Config = {
  apiBaseUrl: API_BASE_URL,
  isBackendEnabled: API_BASE_URL !== null,
};
