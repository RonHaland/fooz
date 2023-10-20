using Azure;
using Azure.Data.Tables;
using foozApi.Models;
using System.Text.Json;

namespace foozApi.Storage.Entities;

public class UserEntity : ITableEntity
{
    public UserEntity()
    {
        
    }
    public UserEntity(User user)
    {
        RowKey = user.Id;
        PartitionKey = user.Locale;
        Name = user.Name;
        Email = user.Email;
        Roles = JsonSerializer.Serialize(user.Roles);
    }
    public string PartitionKey { get; set; } = null!;
    public string Name { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public string RowKey { get; set; } = null!;
    public string Roles { get; set; } = null!;
    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}