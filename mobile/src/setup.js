import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
import * as Crypto from 'expo-crypto';

if (!global.Buffer) {
  global.Buffer = Buffer;
}

if (!global.crypto) {
  global.crypto = Crypto;
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = (typedArray) => {
    const bytes = Crypto.getRandomBytes(typedArray.length);
    typedArray.set(bytes);
    return typedArray;
  };
}

if (!global.__cognitoFetchPatched) {
  const originalFetch = global.fetch;
  global.fetch = async (input, init = {}) => {
    try {
      const url = typeof input === 'string' ? input : input?.url;
      if (url && url.includes('cognito-idp')) {
        let bodyPreview = '';
        if (typeof init.body === 'string') {
          try {
            const parsed = JSON.parse(init.body);
            if (parsed?.AuthParameters?.PASSWORD) {
              parsed.AuthParameters.PASSWORD = '***';
            }
            bodyPreview = JSON.stringify(parsed);
          } catch (parseErr) {
            bodyPreview = init.body.slice(0, 200);
          }
        } else if (init.body) {
          bodyPreview = `[body type: ${typeof init.body}]`;
        }
        console.log('Cognito request', {
          url,
          method: init.method,
          body: bodyPreview,
        });
      }
    } catch (err) {
      console.error('Cognito request log failed', err);
    }
    return originalFetch(input, init);
  };
  global.__cognitoFetchPatched = true;
}
