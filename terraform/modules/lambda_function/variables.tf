variable "function_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "handler" {
  type = string
}

variable "runtime" {
  type = string
}

variable "filename" {
  type = string
}

variable "memory_size" {
  type = number
}

variable "timeout" {
  type = number
}

variable "environment" {
  type = map(string)
}

variable "layers" {
  type    = list(string)
  default = []
}
