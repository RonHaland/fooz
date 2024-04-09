param location string = resourceGroup().location
param registryName string
@secure()
param dockerRegistryPassword string
param dockerRegistryUserName string
param clientImageName string
param apiImageName string

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'fooztournmtstoret00'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

var key = storageAccount.listKeys().keys[0].value
var tableConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${key};TableEndpoint=https://${storageAccount.name}.table.core.windows.net/;'

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'asp-fooz-tournament'
  location: location
  kind: 'linux'
  properties: {
    reserved: true
  }
  sku: {
    name: 'B2'
    capacity: 1
  }
}

resource webApi 'Microsoft.Web/sites@2022-09-01' = {
  name: 'wa-fooz-api'
  location: location
  tags: {}
  kind: 'app,linux,container'
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: dockerRegistryPassword
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: '${registryName}.azurecr.io'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: dockerRegistryUserName
        }
        {
          name: 'TableConnectionString'
          value: tableConnectionString
        }
      ]
      linuxFxVersion: 'DOCKER|${registryName}.azurecr.io/${apiImageName}'
      alwaysOn: true
    }
    serverFarmId: appServicePlan.id
  }
}

resource webApplication 'Microsoft.Web/sites@2022-09-01' = {
  name: 'wa-fooz-client'
  location: location
  tags: {}
  kind: 'app,linux,container'
  properties: {
    siteConfig: {
      appSettings: [
        {
          name: 'DOCKER_REGISTRY_SERVER_PASSWORD'
          value: dockerRegistryPassword
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_URL'
          value: '${registryName}.azurecr.io'
        }
        {
          name: 'DOCKER_REGISTRY_SERVER_USERNAME'
          value: dockerRegistryUserName
        }
        {
          name: 'API_URL'
          value: 'https://${webApi.properties.defaultHostName}'
        }
      ]
      linuxFxVersion: 'DOCKER|${registryName}.azurecr.io/${clientImageName}'
      alwaysOn: true
    }
    serverFarmId: appServicePlan.id
  }
}
