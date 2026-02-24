resource "aws_cognito_user_pool" "this" {
  name                     = var.user_pool_name
  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]
}

resource "aws_cognito_user_pool_client" "this" {
  name                = var.user_pool_client_name
  user_pool_id        = aws_cognito_user_pool.this.id
  generate_secret     = false
  explicit_auth_flows = [
    "ALLOW_USER_SRP_AUTH",
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}
