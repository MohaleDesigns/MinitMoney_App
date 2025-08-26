// App Configuration
export const CONFIG = {
  // GraphQL Configuration
  GRAPHQL: {
    ENDPOINT: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
    WS_ENDPOINT: process.env.EXPO_PUBLIC_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql',
  },
  
  // App Settings
  APP: {
    NAME: 'MinitMoney',
    VERSION: '1.0.0',
    SUPPORT_EMAIL: 'support@minitmoney.com',
  },
  
  // Feature Flags
  FEATURES: {
    GRAPHQL_ENABLED: true,
    OFFLINE_MODE: true,
    PUSH_NOTIFICATIONS: false,
    BIOMETRIC_AUTH: false,
  },
  
  // Cache Settings
  CACHE: {
    TRANSACTION_TTL: 5 * 60 * 1000, // 5 minutes
    USER_PROFILE_TTL: 10 * 60 * 1000, // 10 minutes
    BALANCE_POLL_INTERVAL: 30 * 1000, // 30 seconds
  },
  
  // Validation Rules
  VALIDATION: {
    MIN_AMOUNT: 0.01,
    MAX_AMOUNT: 10000,
    MIN_PASSWORD_LENGTH: 8,
    MAX_DESCRIPTION_LENGTH: 500,
  },
};

// Environment-specific overrides
if (__DEV__) {
  CONFIG.GRAPHQL.ENDPOINT = 'http://localhost:4000/graphql';
  CONFIG.FEATURES.OFFLINE_MODE = true;
} else {
  CONFIG.GRAPHQL.ENDPOINT = 'https://api.minitmoney.com/graphql';
  CONFIG.FEATURES.OFFLINE_MODE = false;
}
