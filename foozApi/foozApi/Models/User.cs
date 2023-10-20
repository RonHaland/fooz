using Discord.Rest;
using foozApi.Storage.Entities;
using System.Text.Json;

namespace foozApi.Models;

public class User
{
    public User()
    {
        
    }

    public User(RestSelfUser user)
    {
        Id = user.Id.ToString();
        Name = user.Username;
        Email = user.Email;
        Locale = user.Locale;
    }

    public User(UserEntity entity)
    {
        Id = entity.RowKey;
        Locale = entity.PartitionKey;
        Email = entity.Email;
        Name = entity.Name;
        Roles = JsonSerializer.Deserialize<IEnumerable<string>>(entity.Roles) ?? Enumerable.Empty<string>();
    }

    public string Id { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string Locale { get; set; } = null!;
    public string Email { get; set; } = null!;
    public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
}
