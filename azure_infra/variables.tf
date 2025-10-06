variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "tenant_id" {
  description = "Azure Tenant ID"
  type        = string
}

variable "project_name" {
  description = "Name prefix for all resources"
  type        = string
  default     = "nextjs-firebase-app"
}

variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "East Asia"
}

variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "nextjs-firebase-rg"
}

variable "admin_username" {
  description = "Admin username for the VM"
  type        = string
  default     = "azureuser"
}

variable "admin_password" {
  description = "Admin password for the VM"
  type        = string
  sensitive   = true
}

variable "vm_size" {
  description = "Size of the virtual machine"
  type        = string
  default     = "Standard_B1s"  
  }
