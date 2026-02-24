# BeautyApp - AWS Serverless Architecture

## 🏗️ Architecture

```
Frontend (React) 
  ↓
API Gateway (HTTP API) - JWT Authentication
  ↓
Lambda Functions:
  ├─ generateUploadUrl → S3 Pre-signed URL
  └─ analyzeFace → Rekognition → DynamoDB
  ↓
AWS Services:
  ├─ Cognito: Authentication & Authorization
  ├─ S3: Temporary image storage (with lifecycle policy)
  ├─ DynamoDB: Recommendations & user history
  └─ Rekognition: Face analysis AI
```

## 📋 Prerequisites

- AWS Account with appropriate permissions
- Node.js 18+
- AWS CLI configured
- Serverless Framework: `npm install -g serverless`

## 🚀 Quick Start

### 1. Setup AWS Resources

#### Cognito User Pool
```bash
# See infrastructure/cognito-setup.md for details
# Create User Pool and App Client
# Note: User Pool ID and Client ID
```

#### S3 Bucket
```bash
# See infrastructure/s3-setup.md for details
# Create bucket: beautyapp-uploads-{region}-{account-id}
# Configure lifecycle policy (auto-delete after 1 day)
```

#### Environment Variables
Create `.env` in infrastructure directory:
```env
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
S3_BUCKET_NAME=beautyapp-uploads-us-east-1-XXXXXXXXX
AWS_REGION=us-east-1
AI_PROVIDER=rekognition
DELETE_IMAGE_AFTER_ANALYSIS=true
```

### 2. Deploy Backend

```bash
cd infrastructure
npm install
serverless deploy
```

### 3. Update Frontend Configuration

Update `frontend/.env`:
```env
VITE_API_GATEWAY_URL=https://your-api-id.execute-api.region.amazonaws.com/dev
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
VITE_AWS_REGION=us-east-1
```

### 4. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication Flow

1. User signs in via Cognito (Hosted UI or Amplify)
2. Cognito returns JWT tokens (idToken, accessToken, refreshToken)
3. Frontend stores tokens in localStorage
4. All API requests include: `Authorization: Bearer {idToken}`
5. Lambda functions verify JWT using Cognito JWKS

## 📡 API Endpoints

### POST /api/upload-url
Generate pre-signed URL for S3 upload.

**Request:**
```json
{
  "fileExtension": "jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/...",
    "fileKey": "uploads/user-id/uuid.jpg",
    "expiresIn": 3600
  }
}
```

### POST /api/analyze-face
Analyze face image and generate recommendations.

**Request:**
```json
{
  "fileKey": "uploads/user-id/uuid.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id-timestamp",
    "analysis": {
      "skinType": "combination",
      "skinTone": "medium",
      "undertone": "warm",
      "facialFeatures": {...}
    },
    "recommendations": {
      "skincare": {...},
      "makeup": {...},
      "outfits": {...}
    },
    "createdAt": "2024-01-12T00:00:00.000Z"
  }
}
```

## 🔄 Complete Flow

1. **User uploads image:**
   - Frontend requests pre-signed URL from Lambda
   - Frontend uploads directly to S3
   - Frontend receives file key

2. **Analysis:**
   - Frontend sends file key to analyze-face Lambda
   - Lambda downloads image from S3
   - Lambda analyzes with Rekognition
   - Lambda generates recommendations
   - Lambda saves to DynamoDB
   - Lambda deletes image from S3 (or lifecycle policy handles it)

3. **Results:**
   - Frontend receives recommendations
   - User views personalized guide

## 💾 DynamoDB Tables

### beautyapp-recommendations
- **Partition Key**: `id` (String)
- **GSI**: `userId-createdAt-index`
- **TTL**: 90 days
- **Storage**: Analysis results and recommendations

### beautyapp-user-history (Optional)
- **Partition Key**: `userId` (String)
- **Sort Key**: `timestamp` (Number)
- **Storage**: User activity history

## 🔧 Configuration

### Lambda Functions
- **generateUploadUrl**: 128MB, 30s timeout
- **analyzeFace**: 1024MB, 60s timeout (for image processing)

### S3 Lifecycle Policy
```json
{
  "Rules": [{
    "Id": "DeleteOldUploads",
    "Status": "Enabled",
    "Prefix": "uploads/",
    "Expiration": { "Days": 1 }
  }]
}
```

### DynamoDB TTL
- Recommendations auto-delete after 90 days
- Reduces storage costs

## 🔒 Security

- **Authentication**: Cognito JWT tokens
- **Authorization**: Lambda verifies tokens on each request
- **S3**: Private bucket, pre-signed URLs only
- **IAM**: Least privilege principle
- **CORS**: Configured for frontend domain

## 📊 Cost Estimation

- **Lambda**: Pay per request (~$0.20 per 1M requests)
- **API Gateway**: HTTP API (~$1.00 per 1M requests)
- **S3**: Storage + requests (~$0.023 per GB)
- **DynamoDB**: On-demand pricing (~$1.25 per million writes)
- **Rekognition**: ~$1.00 per 1000 images

**Estimated cost for 10K users/month**: ~$50-100

## 🛠️ Development

### Local Testing
```bash
# Install dependencies
cd lambda/functions/analyze-face
npm install

# Use AWS SAM or Serverless Offline for local testing
```

### Deployment
```bash
cd infrastructure
serverless deploy --stage dev
serverless deploy --stage prod
```

### Monitoring
- CloudWatch Logs for Lambda functions
- CloudWatch Metrics for API Gateway
- X-Ray for distributed tracing (optional)

## 📚 Additional Resources

- [Serverless Framework Docs](https://www.serverless.com/framework/docs)
- [AWS Cognito Docs](https://docs.aws.amazon.com/cognito/)
- [AWS Lambda Docs](https://docs.aws.amazon.com/lambda/)
- [DynamoDB Docs](https://docs.aws.amazon.com/dynamodb/)







