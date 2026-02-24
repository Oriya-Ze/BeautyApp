"""
AWS Cognito JWT verification and user extraction
"""

import os
import json
import jwt
from jwt import PyJWKClient
import requests
from typing import Dict, Any

def get_jwks_uri():
    """Get JWKS URI from environment"""
    region = os.environ.get('AWS_REGION', 'us-east-1')
    user_pool_id = os.environ.get('COGNITO_USER_POOL_ID')
    return f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json"


def verify_token(token: str) -> Dict[str, Any]:
    """
    Verify JWT token from Cognito
    :param token: JWT token from Authorization header
    :returns: Decoded token payload
    """
    if not token:
        raise ValueError('No token provided')
    
    # Remove 'Bearer ' prefix if present
    if token.startswith('Bearer '):
        token = token[7:]
    
    try:
        region = os.environ.get('AWS_REGION', 'us-east-1')
        user_pool_id = os.environ.get('COGNITO_USER_POOL_ID')
        issuer = f"https://cognito-idp.{region}.amazonaws.com/{user_pool_id}"
        
        # Use PyJWKClient to automatically fetch and cache JWKS
        jwks_uri = get_jwks_uri()
        jwks_client = PyJWKClient(jwks_uri)
        
        # Get signing key from token
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        
        # Verify token
        decoded = jwt.decode(
            token,
            signing_key.key,
            algorithms=['RS256'],
            issuer=issuer
        )
        
        return decoded
    except jwt.ExpiredSignatureError:
        raise ValueError('Token has expired')
    except jwt.InvalidTokenError as e:
        raise ValueError(f'Invalid token: {str(e)}')


def get_user_id(event: Dict[str, Any]) -> str:
    """
    Extract user ID from Cognito token
    :param event: Lambda event
    :returns: User ID (sub from token)
    """
    try:
        headers = event.get('headers', {}) or event.get('requestContext', {}).get('http', {}).get('headers', {})
        token = headers.get('Authorization') or headers.get('authorization')
        
        if not token:
            raise ValueError('No authorization token found')
        
        decoded = verify_token(token)
        return decoded.get('sub')  # Cognito user ID
    except Exception as e:
        raise ValueError('Unauthorized')

