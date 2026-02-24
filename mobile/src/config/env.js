const getEnv = (key, fallback = '') => {
  return process.env[key] ?? fallback;
};

export const API_URL = getEnv('EXPO_PUBLIC_API_URL', 'https://your-api-id.execute-api.us-east-1.amazonaws.com');
export const AWS_REGION = getEnv('EXPO_PUBLIC_AWS_REGION', 'us-east-1');
export const COGNITO_USER_POOL_ID = getEnv('EXPO_PUBLIC_COGNITO_USER_POOL_ID');
export const COGNITO_CLIENT_ID = getEnv('EXPO_PUBLIC_COGNITO_CLIENT_ID');
