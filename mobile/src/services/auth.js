import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import {
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
} from '../config/env';
import cognitoStorage from './cognitoStorage';

const ensureCognitoConfig = () => {
  if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
    throw new Error('Cognito configuration is missing');
  }
};

const getUserPool = () => {
  ensureCognitoConfig();
  return new CognitoUserPool({
    UserPoolId: COGNITO_USER_POOL_ID,
    ClientId: COGNITO_CLIENT_ID,
    Storage: cognitoStorage,
  });
};

const getCognitoUser = (email) => {
  const userPool = getUserPool();
  return new CognitoUser({
    Username: email,
    Pool: userPool,
    Storage: cognitoStorage,
  });
};

const clearDeviceKeys = async (email) => {
  ensureCognitoConfig();
  const username = email;
  const prefix = `CognitoIdentityServiceProvider.${COGNITO_CLIENT_ID}.${username}`;
  const keys = [
    `${prefix}.deviceKey`,
    `${prefix}.deviceGroupKey`,
    `${prefix}.randomPasswordKey`,
  ];
  keys.forEach((key) => cognitoStorage.removeItem(key));
};

export const signUp = (email, password) => {
  const userPool = getUserPool();
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const confirmSignUp = (email, code) => {
  const user = getCognitoUser(email);
  return new Promise((resolve, reject) => {
    user.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

export const signIn = (email, password) => {
  const user = getCognitoUser(email);
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    clearDeviceKeys(email)
      .catch((err) => {
        console.warn('Failed to clear device keys', err);
      })
      .finally(() => {
        user.authenticateUser(authenticationDetails, {
          onSuccess: (session) => resolve({ user, session }),
          onFailure: (err) => reject(err),
          newPasswordRequired: () => reject(new Error('New password required')),
        });
      });
  });
};

export const getSession = () => {
  const userPool = getUserPool();
  const user = userPool.getCurrentUser();

  if (!user) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    user.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ user, session });
    });
  });
};

export const signOut = () => {
  const userPool = getUserPool();
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
  }
};

export const getAccessToken = async () => {
  const current = await getSession();
  if (!current?.session) {
    return null;
  }
  return current.session.getAccessToken().getJwtToken();
};
