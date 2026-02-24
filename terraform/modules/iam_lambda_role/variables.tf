variable "role_name" {
  type = string
}

variable "s3_bucket_arn" {
  type = string
}

variable "dynamodb_table_arn" {
  type = string
}

variable "secretsmanager_secret_arn" {
  type    = string
  default = ""
}