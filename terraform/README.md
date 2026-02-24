# Terraform - BeautyApp Infrastructure

This directory contains a modular Terraform setup for the BeautyApp AWS stack.

## Structure
- `modules/` - reusable Terraform modules
- `envs/dev` - development environment
- `envs/prod` - production environment

## Requirements
- Terraform >= 1.5
- AWS CLI configured
- Lambda ZIP artifacts generated

## Create Lambda ZIPs (Python)

```bash
# s3-presigned
cd lambda/functions/s3-presigned
pip install -r requirements.txt -t .
zip -r s3-presigned.zip .

# analyze-face
cd ../analyze-face
pip install -r requirements.txt -t .
zip -r analyze-face.zip .
```

## Deploy (dev)
```bash
cd terraform/envs/dev
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars to point to your ZIP paths
terraform init
terraform plan
terraform apply
```

## Outputs
- API Gateway URL
- Cognito User Pool ID
- Cognito Client ID
- S3 Bucket name
- DynamoDB table name
