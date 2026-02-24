variable "secret_name" {
  type = string
}

variable "secret_string" {
  type = string
}

variable "description" {
  type    = string
  default = null
}

variable "kms_key_id" {
  type    = string
  default = null
}
