# Azure CLI - Microsoft Azure Command-Line Interface

Manage Azure resources and services from the command line.

## Usage

```bash
# Login to Azure
az login
az login --use-device-code

# List subscriptions
az account list
az account set --subscription "My Subscription"

# Common operations
az group create --name MyResourceGroup --location eastus
az vm list
az webapp list
```

## Description

The Azure CLI (az) is Microsoft's cross-platform command-line tool for managing Azure resources. It provides comprehensive access to Azure services including VMs, storage, databases, containers, and more.

## Installation

Sigao installs Azure CLI using Microsoft's official installation script, ensuring you always get the latest stable version with automatic updates enabled.

## Examples

### Authentication
```bash
# Interactive login (opens browser)
az login

# Device code login (for headless systems)
az login --use-device-code

# Service principal login
az login --service-principal -u <app-id> -p <password> --tenant <tenant>
```

### Resource Groups
```bash
# Create resource group
az group create --name MyRG --location eastus

# List resource groups
az group list --output table

# Delete resource group
az group delete --name MyRG --yes
```

### Virtual Machines
```bash
# Create VM
az vm create \
  --resource-group MyRG \
  --name MyVM \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys

# List VMs
az vm list --output table

# Start/Stop VM
az vm start --name MyVM --resource-group MyRG
az vm stop --name MyVM --resource-group MyRG
```

### Web Apps
```bash
# Create app service plan
az appservice plan create \
  --name MyPlan \
  --resource-group MyRG \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --name MyUniqueAppName \
  --resource-group MyRG \
  --plan MyPlan \
  --runtime "NODE:18-lts"

# Deploy code
az webapp deploy \
  --name MyUniqueAppName \
  --resource-group MyRG \
  --src-path ./app.zip
```

## Common Scenarios

### Container Instances
```bash
# Run container
az container create \
  --name mycontainer \
  --resource-group MyRG \
  --image nginx \
  --dns-name-label myapp \
  --ports 80
```

### Storage
```bash
# Create storage account
az storage account create \
  --name mystorageaccount \
  --resource-group MyRG \
  --location eastus \
  --sku Standard_LRS

# Upload blob
az storage blob upload \
  --account-name mystorageaccount \
  --container-name mycontainer \
  --name myblob \
  --file ./myfile.txt
```

### Kubernetes (AKS)
```bash
# Create AKS cluster
az aks create \
  --resource-group MyRG \
  --name MyAKSCluster \
  --node-count 3 \
  --enable-addons monitoring \
  --generate-ssh-keys

# Get credentials
az aks get-credentials \
  --resource-group MyRG \
  --name MyAKSCluster
```

## Configuration

### Set Defaults
```bash
# Set default resource group
az configure --defaults group=MyRG

# Set default location
az configure --defaults location=eastus

# View configuration
az configure --list-defaults
```

### Output Formats
```bash
# Table output
az vm list --output table

# JSON output (default)
az vm list --output json

# YAML output
az vm list --output yaml

# TSV for scripting
az vm list --output tsv
```

## Tips & Tricks

### Interactive Mode
```bash
# Start interactive mode
az interactive
```

### Query with JMESPath
```bash
# Get specific fields
az vm list --query "[].{name:name, location:location}"

# Filter results
az vm list --query "[?powerState=='VM running']"
```

### Useful Aliases
```bash
# Add to your shell config
alias azl='az login'
alias azs='az account show'
alias azg='az group'
alias azvm='az vm'
```

## Cost Management

```bash
# View current costs
az consumption usage list \
  --start-date 2024-01-01 \
  --end-date 2024-01-31

# Set spending limit alerts
az consumption budget create \
  --amount 100 \
  --budget-name MyBudget \
  --time-grain Monthly
```

## Related Commands

- `docker` - Container management
- `kubectl` - Kubernetes management
- `terraform` - Infrastructure as Code

## See Also

- Azure CLI Documentation: https://docs.microsoft.com/cli/azure/
- Azure Portal: https://portal.azure.com
- `sigao help docker` - Container basics