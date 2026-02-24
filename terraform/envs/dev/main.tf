provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  api_domain_name = "${var.api_subdomain}.${var.domain_name}"
  route53_zone_id = var.create_route53_zone ? aws_route53_zone.primary[0].zone_id : var.route53_zone_id
}

module "s3" {
  source         = "../../modules/s3_bucket"
  bucket_name    = "${var.project}-uploads-${var.aws_region}-${data.aws_caller_identity.current.account_id}"
  lifecycle_days = var.s3_lifecycle_days
}

module "dynamodb" {
  source     = "../../modules/dynamodb_table"
  table_name = "${var.project}-recommendations-${var.stage}"
}

module "cognito" {
  source                = "../../modules/cognito"
  user_pool_name        = "${var.project}-user-pool-${var.stage}"
  user_pool_client_name = "${var.project}-client-${var.stage}"
}

module "iam" {
  source                    = "../../modules/iam_lambda_role"
  role_name                 = "${var.project}-lambda-role-${var.stage}"
  s3_bucket_arn              = module.s3.bucket_arn
  dynamodb_table_arn         = module.dynamodb.table_arn
  secretsmanager_secret_arn  = var.external_ai_secret_arn
}

module "lambda_s3_presigned" {
  source        = "../../modules/lambda_function"
  function_name = "${var.project}-s3-presigned-${var.stage}"
  role_arn      = module.iam.role_arn
  handler       = "handler.lambda_handler"
  runtime       = var.lambda_runtime
  filename      = var.s3_presigned_zip
  memory_size   = 256
  timeout       = 30

  environment = {
    S3_BUCKET_NAME       = module.s3.bucket_name
    COGNITO_USER_POOL_ID = module.cognito.user_pool_id
  }
}

module "lambda_analyze_face" {
  source        = "../../modules/lambda_function"
  function_name = "${var.project}-analyze-face-${var.stage}"
  role_arn      = module.iam.role_arn
  handler       = "handler.lambda_handler"
  runtime       = var.lambda_runtime
  filename      = var.analyze_face_zip
  memory_size   = 1024
  timeout       = 60

  environment = {
    S3_BUCKET_NAME                 = module.s3.bucket_name
    DYNAMODB_RECOMMENDATIONS_TABLE = module.dynamodb.table_name
    COGNITO_USER_POOL_ID           = module.cognito.user_pool_id
    AI_PROVIDER                    = "external"
    EXTERNAL_AI_URL                = var.external_ai_url
    EXTERNAL_AI_SECRET_ARN         = var.external_ai_secret_arn
    EXTERNAL_AI_HEADER             = var.external_ai_header
    EXTERNAL_AI_SCHEME             = var.external_ai_scheme
    DELETE_IMAGE_AFTER_ANALYSIS    = "true"
  }
}

module "apigw" {
  source  = "../../modules/apigw_http"
  api_name = "${var.project}-api-${var.stage}"

  routes = [
    {
      method            = "POST"
      path              = "/api/upload-url"
      lambda_invoke_arn = module.lambda_s3_presigned.invoke_arn
      lambda_name       = module.lambda_s3_presigned.function_name
    },
    {
      method            = "POST"
      path              = "/api/analyze-face"
      lambda_invoke_arn = module.lambda_analyze_face.invoke_arn
      lambda_name       = module.lambda_analyze_face.function_name
    }
  ]

  cors_allow_origins = ["*"]
  cors_allow_methods = ["POST", "OPTIONS"]
  cors_allow_headers = ["Content-Type", "Authorization"]
}

resource "aws_route53_zone" "primary" {
  count = var.enable_custom_domain && var.create_route53_zone ? 1 : 0
  name  = var.route53_zone_name
}

resource "aws_acm_certificate" "api" {
  count             = var.enable_custom_domain ? 1 : 0
  domain_name       = local.api_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "api_cert_validation" {
  for_each = var.enable_custom_domain ? {
    for dvo in aws_acm_certificate.api[0].domain_validation_options :
    dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id = local.route53_zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

resource "aws_acm_certificate_validation" "api" {
  count                   = var.enable_custom_domain ? 1 : 0
  certificate_arn         = aws_acm_certificate.api[0].arn
  validation_record_fqdns = [for record in aws_route53_record.api_cert_validation : record.fqdn]
}

resource "aws_apigatewayv2_domain_name" "api" {
  count       = var.enable_custom_domain ? 1 : 0
  domain_name = local.api_domain_name

  domain_name_configuration {
    certificate_arn = aws_acm_certificate_validation.api[0].certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "api" {
  count       = var.enable_custom_domain ? 1 : 0
  api_id      = module.apigw.api_id
  domain_name = aws_apigatewayv2_domain_name.api[0].id
  stage       = "$default"
}

resource "aws_route53_record" "api_alias" {
  count   = var.enable_custom_domain ? 1 : 0
  zone_id = local.route53_zone_id
  name    = local.api_domain_name
  type    = "A"

  alias {
    name                   = aws_apigatewayv2_domain_name.api[0].domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.api[0].domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
