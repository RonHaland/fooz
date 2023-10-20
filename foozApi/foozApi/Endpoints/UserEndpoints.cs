using Discord.Rest;
using foozApi.Models;
using foozApi.Services;

namespace foozApi.Endpoints;

public static class UserEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("User")
            .WithOpenApi();
    }

    public static WebApplication AddUserEndpoints(this WebApplication app)
    {
        var userService = app.Services.GetRequiredService<UserService>();
        app.MapGet("/user/roles", async (HttpRequest request) =>
        {
            var token = request.Headers["Authorization"].FirstOrDefault()?.Split(" ")[1];
            var result = Enumerable.Empty<string>();
            try
            {
                await using var client = new DiscordRestClient();
                await client.LoginAsync(Discord.TokenType.Bearer, token);
                var user = new User(client.CurrentUser);
                var roles = await userService.UpdateUserAndGetRoles(user);
                result = roles;
            }
            catch (Exception e)
            {
                Console.Out.WriteLine(e);
                return Results.Problem(e.ToString());
            }

            return Results.Ok(result);
        });

        return app;
    }
}
