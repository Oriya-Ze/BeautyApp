"""
Standard Lambda response helpers
"""

def success(data, status_code=200):
    """Generate success response"""
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps({
            'success': True,
            'data': data
        })
    }


def error(message, status_code=500, error_details=None):
    """Generate error response"""
    import os
    import traceback
    
    response_body = {
        'success': False,
        'error': message
    }
    
    # Include error details only in development
    if error_details and os.environ.get('NODE_ENV') == 'development':
        response_body['details'] = str(error_details)
        response_body['traceback'] = traceback.format_exc()
    
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': json.dumps(response_body)
    }


def cors_response():
    """Generate CORS preflight response"""
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
        },
        'body': ''
    }

