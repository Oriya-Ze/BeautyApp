"""
DynamoDB Service - Database operations
"""

import os
import boto3
from datetime import datetime
from typing import Dict, Any, List, Optional
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

TABLES = {
    'RECOMMENDATIONS': os.environ.get('DYNAMODB_RECOMMENDATIONS_TABLE', 'beautyapp-recommendations'),
    'USER_HISTORY': os.environ.get('DYNAMODB_USER_HISTORY_TABLE', 'beautyapp-user-history')
}


def save_recommendation(user_id: str, analysis: Dict[str, Any], 
                       recommendations: Dict[str, Any], image_key: str) -> Dict[str, Any]:
    """
    Save recommendation to DynamoDB
    :param user_id: Cognito user ID
    :param analysis: Face analysis results
    :param recommendations: Generated recommendations
    :param image_key: S3 image key
    :returns: Saved item
    """
    table = dynamodb.Table(TABLES['RECOMMENDATIONS'])
    timestamp = datetime.utcnow().isoformat()
    item_id = f"{user_id}-{int(datetime.utcnow().timestamp() * 1000)}"
    
    # Calculate TTL (90 days from now)
    ttl = int(datetime.utcnow().timestamp()) + (90 * 24 * 60 * 60)
    
    item = {
        'id': item_id,
        'userId': user_id,
        'analysis': analysis,
        'recommendations': recommendations,
        'imageKey': image_key,
        'createdAt': timestamp,
        'ttl': ttl
    }
    
    table.put_item(Item=item)
    return item


def get_user_recommendations(user_id: str, limit: int = 10) -> List[Dict[str, Any]]:
    """
    Get user recommendation history
    :param user_id: Cognito user ID
    :param limit: Max number of items to return
    :returns: User recommendations
    """
    from boto3.dynamodb.conditions import Key
    
    table = dynamodb.Table(TABLES['RECOMMENDATIONS'])
    
    response = table.query(
        IndexName='userId-createdAt-index',
        KeyConditionExpression=Key('userId').eq(user_id),
        ScanIndexForward=False,  # Most recent first
        Limit=limit
    )
    
    return response.get('Items', [])


def get_recommendation(recommendation_id: str) -> Optional[Dict[str, Any]]:
    """
    Get recommendation by ID
    :param recommendation_id: Recommendation ID
    :returns: Recommendation or None
    """
    table = dynamodb.Table(TABLES['RECOMMENDATIONS'])
    
    response = table.get_item(Key={'id': recommendation_id})
    return response.get('Item')


def delete_recommendation(recommendation_id: str, user_id: str):
    """
    Delete recommendation
    :param recommendation_id: Recommendation ID
    :param user_id: Cognito user ID (for authorization)
    """
    table = dynamodb.Table(TABLES['RECOMMENDATIONS'])
    
    # First verify ownership
    item = get_recommendation(recommendation_id)
    if item and item.get('userId') != user_id:
        raise ValueError('Unauthorized: Recommendation does not belong to user')
    
    table.delete_item(Key={'id': recommendation_id})

