variable "api_name" { type = string }
variable "routes" {
  type = list(object({
    method            = string
    path              = string
    lambda_invoke_arn = string
    lambda_name       = string
  }))
}
variable "cors_allow_origins" { type = list(string) }
variable "cors_allow_methods" { type = list(string) }
variable "cors_allow_headers" { type = list(string) }
