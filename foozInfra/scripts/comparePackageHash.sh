#!/bin/bash
# Compares hash of current package.json to hash stored in blob storage. returns isEqual=true if they match, or isEqual=false if not
set -e
set -o

echo -e "/nCurrent dir:"
echo $(ls)

echo -e "\n\nLogging into Azure thourgh CLI..."
az login --service-principal -u "$ARM_CLIENT_ID" -p "$ARM_CLIENT_SECRET" --tenant "$ARM_TENANT_ID" || (echo -e "\n\nFailed to log in to Azure."; exit 1)

echo -e "\n\nSetting working subscription..."
az account set --subscription "$ARM_SUBSCRIPTION_ID" || (echo -e "\n\nFailed to set working subscription."; exit 1)

echo -e "\n\nCreating storage account...\n\n"
az storage account create --name "$AZ_STORAGE_NAME" --resource-group "$AZ_RESOURCE_GROUP" --location "$AZ_LOCATION" --sku Standard_LRS --tags Application="fooz" || (echo -e "\n\nFailed to create Azure storage account."; exit 1)

echo -e "\n\nCreating storage container...\n\n"
az storage container create --name "$AZ_STORAGE_CONTAINER_NAME" --account-name "$AZ_STORAGE_NAME" --auth-mode login || (echo -e "\n\nFailed to create Azure container."; exit 1)
#az storage table create --name "AZ_STORAGE_TABLE_NAME" --account-name "$AZ_STORAGE_NAME" --auth-mode login || (echo -e "\n\nFailed to create Azure table."; exit 1)

echo -e "\n\nAdd role assignment...\n\n"
az role assignment create --assignee "$ARM_CLIENT_ID" \
                    --role "Storage Blob Data Contributor" \
                    --scope "/subscriptions/$ARM_SUBSCRIPTION_ID/resourceGroups/$AZ_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$AZ_STORAGE_NAME/blobServices/default/containers/$AZ_STORAGE_CONTAINER_NAME"
az role assignment create --assignee "$ARM_CLIENT_ID" \
                    --role "Storage Blob Data Reader" \
                    --scope "/subscriptions/$ARM_SUBSCRIPTION_ID/resourceGroups/$AZ_RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$AZ_STORAGE_NAME/blobServices/default/containers/$AZ_STORAGE_CONTAINER_NAME"


echo -e "\n\nChecking for hash file...\n\n"
exists=($(az storage blob exists --name "$BRANCH_NAME.txt" --container-name "$AZ_STORAGE_CONTAINER_NAME" --account-name "$AZ_STORAGE_NAME" --auth-mode login | \
python3 -c "import sys, json; print(json.load(sys.stdin)['exists'])"))

if [ $exists = "False" ] 
then 
  echo -e "no file found, need to build new image"
  echo "isEqual=false" >> $GITHUB_OUTPUT
  exit 0
fi

echo -e "\n\nDownloading hash file...\n\n"
hashFile=($(az storage blob download --name "$BRANCH_NAME.txt" --container-name "$AZ_STORAGE_CONTAINER_NAME" --account-name "$AZ_STORAGE_NAME" --auth-mode login))

currentVersionHash=($(shasum -a 256 ./foozclient/package.json))

echo -e "\n\nCOMPARING:"
echo $currentVersionHash
echo $hashFile
echo -e "\n\n"

if [ $currentVersionHash = $hashFile ]
then
  echo -e "All good"
  echo "isEqual=true" >> $GITHUB_OUTPUT
else
  echo -e "Need to update hash file and rebuild base image"
  echo "isEqual=false" >> $GITHUB_OUTPUT
fi
