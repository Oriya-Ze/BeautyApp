/**
 * AWS Cognito Authentication Service (Custom UI)
 */

import { COGNITO_CONFIG } from './api'

const COGNITO_ENDPOINT = `https://cognito-idp.${COGNITO_CONFIG.region}.amazonaws.com/`

export const signIn = async (email, password) => {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1'
    },
    body: JSON.stringify({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: COGNITO_CONFIG.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Authentication failed')
  }

  if (data.AuthenticationResult) {
    localStorage.setItem('idToken', data.AuthenticationResult.IdToken)
    localStorage.setItem('accessToken', data.AuthenticationResult.AccessToken)
    localStorage.setItem('refreshToken', data.AuthenticationResult.RefreshToken)
  }

  return data.AuthenticationResult
}

export const signUp = async (email, password) => {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp',
      'Content-Type': 'application/x-amz-json-1.1'
    },
    body: JSON.stringify({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      Password: password
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Signup failed')
  }

  return data
}

export const confirmSignUp = async (email, code) => {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp',
      'Content-Type': 'application/x-amz-json-1.1'
    },
    body: JSON.stringify({
      ClientId: COGNITO_CONFIG.clientId,
      Username: email,
      ConfirmationCode: code
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || 'Verification failed')
  }

  return data
}

export const signOut = () => {
  localStorage.removeItem('idToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}

export const getToken = () => {
  return localStorage.getItem('idToken')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('idToken')
}
