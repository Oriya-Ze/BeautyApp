"""
AI Service - External API integration
"""

import os
import json
import requests
import boto3
import time
from typing import Dict, Any

_secret_cache = None


def _get_secret_value() -> str:
    """
    Fetch external AI secret from AWS Secrets Manager.
    Supports raw secret string or JSON with common keys.
    """
    global _secret_cache
    if _secret_cache:
        return _secret_cache

    secret_arn = os.environ.get('EXTERNAL_AI_SECRET_ARN')
    if not secret_arn:
        raise ValueError('EXTERNAL_AI_SECRET_ARN is required')

    client = boto3.client('secretsmanager', region_name=os.environ.get('AWS_REGION', 'us-east-1'))
    response = client.get_secret_value(SecretId=secret_arn)
    secret_string = response.get('SecretString', '')

    # If JSON, try common keys
    try:
        secret_json = json.loads(secret_string)
        for key in ('api_key', 'key', 'token', 'secret'):
            if key in secret_json:
                _secret_cache = secret_json[key]
                return _secret_cache
    except Exception:
        pass

    _secret_cache = secret_string
    return _secret_cache


def _build_auth_headers() -> Dict[str, str]:
    """
    Build authorization headers for external AI API.
    Supports:
    - EXTERNAL_AI_HEADER (default: Authorization)
    - EXTERNAL_AI_SCHEME (default: Bearer)
    - EXTERNAL_AI_SECRET_ARN (Secrets Manager)
    """
    headers = {}
    api_key = _get_secret_value()
    auth_header = os.environ.get('EXTERNAL_AI_HEADER', 'Authorization')
    auth_scheme = os.environ.get('EXTERNAL_AI_SCHEME', 'Bearer')

    if api_key:
        if auth_header.lower() == 'authorization':
            headers[auth_header] = f"{auth_scheme} {api_key}"
        else:
            headers[auth_header] = api_key

    return headers


def _get_base_url() -> str:
    base_url = (
        os.environ.get('EXTERNAL_AI_URL')
        or os.environ.get('YOUCAM_BASE_URL')
        or 'https://yce-api-01.makeupar.com'
    )
    return base_url.rstrip('/')


def _map_youcam_result(data: Dict[str, Any]) -> Dict[str, Any]:
    output = data.get('results', {}).get('output', [])
    by_type = {item.get('type'): item for item in output if item.get('type')}

    def _score_for(metric: str):
        item = by_type.get(metric, {})
        score = item.get('ui_score')
        if isinstance(score, (int, float)):
            return score
        score = item.get('raw_score')
        if isinstance(score, (int, float)):
            return score
        return None

    oiliness = _score_for('oiliness')
    moisture = _score_for('moisture')
    redness = _score_for('redness')

    skin_type = 'combination'
    if isinstance(oiliness, (int, float)) and isinstance(moisture, (int, float)):
        if isinstance(redness, (int, float)) and redness >= 70:
            skin_type = 'sensitive'
        elif oiliness >= 70 and moisture <= 40:
            skin_type = 'oily'
        elif moisture <= 40 and oiliness < 60:
            skin_type = 'dry'
        elif oiliness >= 60 and moisture >= 40:
            skin_type = 'combination'

    return {
        'skinType': skin_type,
        'skinTone': 'medium',
        'undertone': 'neutral',
        'facialFeatures': {'faceShape': 'oval'},
        'rawYouCam': data
    }


def analyze_face(image_buffer: bytes) -> Dict[str, Any]:
    """
    Analyze face using YouCam Skin Analysis API.
    Requires:
    - EXTERNAL_AI_URL or YOUCAM_BASE_URL
    - EXTERNAL_AI_SECRET_ARN (Secrets Manager)
    """
    provider = os.environ.get('AI_PROVIDER', 'external')
    if provider != 'external':
        raise ValueError('AI_PROVIDER must be external when using external AI service')

    base_url = _get_base_url()
    headers = {
        'Content-Type': 'application/json',
        **_build_auth_headers()
    }

    file_name = 'skin_analysis.jpg'
    content_type = 'image/jpeg'

    try:
        file_id = _youcam_upload_file(
            base_url=base_url,
            headers=headers,
            task_name='skin-analysis',
            image_buffer=image_buffer,
            file_name=file_name,
            content_type=content_type
        )
        task_response = requests.post(
            f'{base_url}/s2s/v2.0/task/skin-analysis',
            headers=headers,
            data=json.dumps({
                'src_file_id': file_id,
                'dst_actions': [
                    'wrinkle', 'pore', 'texture', 'acne', 'oiliness', 'moisture',
                    'redness', 'radiance', 'age_spot', 'dark_circle_v2', 'eye_bag',
                    'firmness', 'droopy_upper_eyelid', 'droopy_lower_eyelid'
                ],
                'format': 'json'
            }),
            timeout=60
        )
        if task_response.status_code >= 400:
            raise ValueError(f'YouCam task error: {task_response.status_code} {task_response.text}')

        task_id = task_response.json().get('data', {}).get('task_id')
        if not task_id:
            raise ValueError('YouCam task_id missing in response')

        task_result = _poll_youcam_task(base_url, headers, 'skin-analysis', task_id)
        analysis = _map_youcam_result(task_result)

        face_attr_result = _run_face_attr_analysis(
            base_url=base_url,
            headers=headers,
            image_buffer=image_buffer,
            file_name='face_attr.jpg',
            content_type=content_type
        )
        if face_attr_result:
            face_attr_payload = _map_youcam_face_attr(face_attr_result)
            analysis.update(face_attr_payload)
            face_shape = face_attr_payload.get('facialFeatures', {}).get('faceShape')
            if face_shape:
                analysis['facialFeatures'] = {'faceShape': face_shape}

        return analysis
    except Exception as e:
        print(f'External AI error: {str(e)}')
        raise


def _poll_youcam_task(base_url: str, headers: Dict[str, str], task_name: str, task_id: str, interval: int = 2, max_attempts: int = 60) -> Dict[str, Any]:
    for _ in range(max_attempts):
        response = requests.get(
            f'{base_url}/s2s/v2.0/task/{task_name}/{task_id}',
            headers={k: v for k, v in headers.items() if k.lower() != 'content-type'},
            timeout=60
        )
        if response.status_code >= 400:
            raise ValueError(f'YouCam task status error: {response.status_code} {response.text}')

        payload = response.json().get('data', {})
        status = payload.get('task_status')

        if status == 'success':
            return payload
        if status == 'error':
            raise ValueError(payload.get('error_message') or payload.get('error') or f'{task_name} failed')

        time.sleep(interval)

    raise ValueError(f'{task_name} polling timed out')


def _youcam_upload_file(
    base_url: str,
    headers: Dict[str, str],
    task_name: str,
    image_buffer: bytes,
    file_name: str,
    content_type: str
) -> str:
    file_size = len(image_buffer)
    upload_response = requests.post(
        f'{base_url}/s2s/v2.0/file/{task_name}',
        headers=headers,
        data=json.dumps({
            'files': [{
                'content_type': content_type,
                'file_name': file_name,
                'file_size': file_size
            }]
        }),
        timeout=60
    )
    if upload_response.status_code >= 400:
        raise ValueError(f'YouCam upload init error: {upload_response.status_code} {upload_response.text}')

    upload_payload = upload_response.json().get('data', {})
    upload_file = (upload_payload.get('files') or [{}])[0]
    upload_request = (upload_file.get('requests') or [{}])[0]
    file_id = upload_file.get('file_id')

    upload_url = upload_request.get('url')
    if not upload_url or not file_id:
        raise ValueError('YouCam upload URL missing in response')

    upload_headers = upload_request.get('headers') or {}
    if 'Content-Type' not in upload_headers and 'content-type' not in upload_headers:
        upload_headers['Content-Type'] = content_type
    if 'Content-Length' not in upload_headers and 'content-length' not in upload_headers:
        upload_headers['Content-Length'] = str(file_size)

    upload_put = requests.put(
        upload_url,
        headers=upload_headers,
        data=image_buffer,
        timeout=60
    )
    if upload_put.status_code >= 400:
        raise ValueError(f'YouCam upload error: {upload_put.status_code} {upload_put.text}')

    return file_id


def _run_face_attr_analysis(
    base_url: str,
    headers: Dict[str, str],
    image_buffer: bytes,
    file_name: str,
    content_type: str
) -> Dict[str, Any]:
    features = [
        'faceShape', 'age', 'gender',
        'eyeShape', 'eyeSize', 'eyeAngle', 'eyeDistance', 'eyelid',
        'eyebrowShape', 'eyebrowThickness', 'eyebrowDistance', 'eyebrowShortness',
        'lipShape', 'noseWidth', 'noseLength', 'cheekbones',
        'eyeColor', 'lipColor', 'eyebrowColor', 'hairColor',
        'horizontalThird', 'verticalFifth', 'faceAspectRatio', 'eyeAspectRatio',
        'eyebrowPosition', 'eyebrowArch', 'eyeHeightToEyebrowDistance',
        'noseAspectRatio', 'noseWidthToMouthWidth', 'noseToLipToChin', 'upperLipToLowerLip'
    ]
    file_id = _youcam_upload_file(
        base_url=base_url,
        headers=headers,
        task_name='face-attr-analysis',
        image_buffer=image_buffer,
        file_name=file_name,
        content_type=content_type
    )
    task_response = requests.post(
        f'{base_url}/s2s/v2.0/task/face-attr-analysis',
        headers=headers,
        data=json.dumps({
            'src_file_id': file_id,
            'face_angle_strictness_level': 'high',
            'features': features
        }),
        timeout=60
    )
    if task_response.status_code >= 400:
        raise ValueError(f'YouCam face attr task error: {task_response.status_code} {task_response.text}')

    task_id = task_response.json().get('data', {}).get('task_id')
    if not task_id:
        raise ValueError('YouCam face attr task_id missing in response')

    return _poll_youcam_task(base_url, headers, 'face-attr-analysis', task_id)


def _map_youcam_face_attr(data: Dict[str, Any]) -> Dict[str, Any]:
    results = data.get('results', {})
    face_shape = results.get('faceshape')
    face_attributes = {
        'faceShape': face_shape,
        'ageGender': results.get('agegender'),
        'eyes': results.get('eyelid'),
        'eyebrows': results.get('eyebrow'),
        'lips': results.get('lipshape'),
        'nose': results.get('nose'),
        'cheekbones': results.get('cheekbone'),
        'colors': results.get('color')
    }
    face_ratios = results.get('facialratio')
    return {
        'facialFeatures': {'faceShape': face_shape} if face_shape else {'faceShape': 'oval'},
        'faceAttributes': face_attributes,
        'faceRatios': face_ratios,
        'rawYouCamFaceAttr': data
    }




