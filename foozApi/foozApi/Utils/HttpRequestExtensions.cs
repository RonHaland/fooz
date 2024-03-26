using foozApi.Services;

namespace foozApi.Utils;

public static class HttpRequestExtensions
{
    public async static Task<IEnumerable<string>> GetRoles(this HttpRequest request, UserService userService)
    {
        var userToken = request.Headers["Authorization"].FirstOrDefault()?.Split(" ")[1] ?? "";

        var user = await userService.GetUserFromToken(userToken);
        var roles = await userService.UpdateUserAndGetRoles(user);
        return roles;
    }

    public async static Task<bool> IsAdmin(this HttpRequest request, UserService userService)
    {
        return true;
        return await request.HasRole(userService, UserRole.Admin);
    }

    public async static Task<bool> HasRole(this HttpRequest request, UserService userService, UserRole role)
    {
        return true;
        var roles = await request.GetRoles(userService);
        return roles.Contains(role.ToString());
    }
}
