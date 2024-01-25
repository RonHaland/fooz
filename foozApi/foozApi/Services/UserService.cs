using AzureTableContext;
using Discord.Rest;
using foozApi.Models;
using System.Runtime.Caching;

namespace foozApi.Services;

public class UserService
{
    private readonly TableContext _tableContext;
    private readonly MemoryCache _cache = new("TokenCache");

    public UserService(TableContext tableContext)
    {
        _tableContext = tableContext;
    }


    public async Task<IEnumerable<string>> UpdateUserAndGetRoles(User user)
    {
        var existingUsers = await _tableContext.QueryAsync<User>($"PartitionKey eq '{user.PartitionKey}' and RowKey eq '{user.Id}'");
        if (existingUsers != null && existingUsers.Any())
        {
            var fetchedUser = existingUsers.First();
            user.Roles = fetchedUser.Roles;
        }
        await _tableContext.Save(user);

        return user.Roles;
    }

    public async Task<User> GetUserFromToken(string userToken)
    {
        var cachedUser = _cache.Get(userToken);

        if (cachedUser != null)
        {
            return (User)cachedUser;
        }

        await using var client = new DiscordRestClient();
        await client.LoginAsync(Discord.TokenType.Bearer, userToken);
        var user = new User(client.CurrentUser);

        _cache.Set(userToken, user, DateTimeOffset.UtcNow.AddMinutes(30));

        return user;
    }
}

public enum UserRole
{
    Admin,
}
