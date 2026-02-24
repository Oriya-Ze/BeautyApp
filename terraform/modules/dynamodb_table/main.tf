resource "aws_dynamodb_table" "this" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  global_secondary_index {
    name            = "userId-createdAt-index"
    projection_type = "ALL"

    key_schema {
      attribute_name = "userId"
      key_type       = "HASH"
    }

    key_schema {
      attribute_name = "createdAt"
      key_type       = "RANGE"
    }
  }

  ttl {
    attribute_name = var.ttl_attribute
    enabled        = true
  }
}
