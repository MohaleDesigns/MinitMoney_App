// Configuration for different environments
export const config = {
  // Development - use your computer's IP address
  development: {
    apiBaseUrl: 'http://192.168.43.70:3001',
  },
  
  // Production - use your actual production server
  production: {
    apiBaseUrl: 'https://your-production-server.com',
  },
  
  // Web development - use localhost
  web: {
    apiBaseUrl: 'http://localhost:3001',
  }
};

// Get current environment
export const getCurrentConfig = () => {
  // For web development, use localhost
  if (typeof window !== 'undefined') {
    return config.web;
  }
  // For React Native, use development config
  return config.development;
};

export const API_BASE_URL = getCurrentConfig().apiBaseUrl;
