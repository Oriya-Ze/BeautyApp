locals {
  base_statements = [
    {
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ]
      Resource = "arn:aws:logs:*:*:*"
    },
    {
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Resource = "${var.s3_bucket_arn}/*"
    },
    {
      Effect = "Allow"
      Action = [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:DeleteItem",
        "dynamodb:UpdateItem"
      ]
      Resource = [
        var.dynamodb_table_arn,
        "${var.dynamodb_table_arn}/index/*"
      ]
    }
  ]

  secrets_statement = var.secretsmanager_secret_arn != "" ? [
    {
      Effect = "Allow"
      Action = [
        "secretsmanager:GetSecretValue"
      ]
      Resource = var.secretsmanager_secret_arn
    }
  ] : []
}

resource "aws_iam_role" "lambda_role" {
  name = var.role_name

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name = "${var.role_name}-policy"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(local.base_statements, local.secrets_statement)
  })
}

resource "aws_iam_role_policy_attachment" "attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}
