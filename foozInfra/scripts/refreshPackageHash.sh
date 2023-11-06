#!/bin/bash
# Creates hash for package.json and uploads to blob storage, replaces if exists
set -e
set -o

echo -e "/nCurrent dir:"
echo $(ls)
echo -e "\n\n new hash:"
newHash=($(shasum -a 256 ./remix-app/package.json))
echo $newHash
echo -e "\n\n"

echo -e "\n\nLogging into Azure thourgh CLI..."
az login --service-principal -u "$ARM_CLIENT_ID" -p "$ARM_CLIENT_SECRET" --tenant "$ARM_TENANT_ID" || (echo -e "\n\nFailed to log in to Azure."; exit 1)

echo -e "\n\nSetting working subscription..."
az account set --subscription "$ARM_SUBSCRIPTION_ID" || (echo -e "\n\nFailed to set working subscription."; exit 1)

echo -e "\n\nUpload hash file...\n\n"
echo $newHash | az storage blob upload --data @- --name "$BRANCH_NAME.txt" --container-name "$AZ_STORAGE_CONTAINER_NAME" --account-name "$AZ_STORAGE_NAME" --auth-mode login --overwrite true
