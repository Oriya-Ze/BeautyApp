variable "project" {
  type = string
}

variable "stage" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "s3_lifecycle_days" {
  type = number
}

variable "lambda_runtime" {
  type    = string
  default = "python3.11"
}

variable "s3_presigned_zip" {
  type = string
}

variable "analyze_face_zip" {
  type = string
}

variable "external_ai_url" {
  type = string
}

variable "external_ai_secret_arn" {
  type = string
}

variable "external_ai_header" {
  type    = string
  default = "Authorization"
}

variable "external_ai_scheme" {
  type    = string
  default = "Bearer"
}

variable "enable_custom_domain" {
  type    = bool
  default = false
}

variable "domain_name" {
  type    = string
  default = ""
}

variable "api_subdomain" {
  type    = string
  default = "api"
}

variable "route53_zone_id" {
  type    = string
  default = ""
}

variable "create_route53_zone" {
  type    = bool
  default = false
}

variable "route53_zone_name" {
  type    = string
  default = ""
}
