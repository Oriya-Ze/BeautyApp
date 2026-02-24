"""
S3 Service - Pre-signed URLs and file operations
"""

import os
import uuid
import boto3
from botocore.config import Config
from typing import Dict, Any

s3_client = boto3.client('s3', region_name=os.environ.get('AWS_REGION', 'us-east-1'))

BUCKET_NAME = os.environ.get('S3_BUCKET_NAME')
UPLOAD_PREFIX = 'uploads/'
EXPIRATION_TIME = 3600  # 1 hour for pre-signed URLs


def generate_upload_url(user_id: str, file_extension: str = 'jpg') -> Dict[str, Any]:
    """
    Generate pre-signed URL for uploading image
    :param user_id: Cognito user ID
    :param file_extension: File extension (e.g., 'jpg')
    :returns: { uploadUrl, fileKey, expiresIn }
    """
    file_key = f"{UPLOAD_PREFIX}{user_id}/{uuid.uuid4()}.{file_extension}"
    
    upload_url = s3_client.generate_presigned_url(
        'put_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': file_key,
            'ContentType': f'image/{file_extension}'
        },
        ExpiresIn=EXPIRATION_TIME
    )
    
    return {
        'uploadUrl': upload_url,
        'fileKey': file_key,
        'expiresIn': EXPIRATION_TIME
    }


def get_image(file_key: str) -> bytes:
    """
    Get image from S3
    :param file_key: S3 object key
    :returns: Image buffer (bytes)
    """
    response = s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)
    return response['Body'].read()


def delete_image(file_key: str):
    """
    Delete image from S3
    :param file_key: S3 object key
    """
    s3_client.delete_object(Bucket=BUCKET_NAME, Key=file_key)


def delete_images(file_keys: list):
    """
    Delete multiple images
    :param file_keys: List of S3 object keys
    """
    if not file_keys:
        return
    
    objects = [{'Key': key} for key in file_keys]
    s3_client.delete_objects(
        Bucket=BUCKET_NAME,
        Delete={'Objects': objects, 'Quiet': True}
    )




