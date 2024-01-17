using AzureTableContext;
using foozApi.OldModels;

namespace foozApi.Services;

public class UserService
{
    private readonly TableContext _tableContext;

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
}

public enum UserRole
{
    Admin,
}
