using Azure.Data.Tables;
using foozApi.Models;
using foozApi.Storage.Entities;
using System.Text.Json;

namespace foozApi.Services;

public class UserService
{
    public UserService(IConfiguration config)
    {
        var connectionString = config.GetValue<string>("TableConnectionString");

        UserClient = new TableClient(connectionString, "Users");
        UserClient.CreateIfNotExists();
    }

    public TableClient UserClient { get; private set; }

    public async Task<IEnumerable<string>> UpdateUserAndGetRoles(User user)
    {
        var userEntity = new UserEntity(user);
        var existing = await UserClient.GetEntityIfExistsAsync<UserEntity>(userEntity.PartitionKey, userEntity.RowKey);
        if (existing != null && existing.HasValue)
        {
            userEntity.Roles = existing.Value.Roles;
            userEntity.ETag = existing.Value.ETag;
        }
        var roles = JsonSerializer.Deserialize<List<string>>(userEntity.Roles) ?? new List<string>();
        await UserClient.UpsertEntityAsync(userEntity);

        return roles;
    }
}

public enum UserRole
{
    Admin,
}
