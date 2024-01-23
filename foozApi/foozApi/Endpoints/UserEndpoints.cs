using foozApi.Services;
using foozApi.Utils;

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
            var result = Enumerable.Empty<string>();
            try
            {
                var roles = await request.GetRoles(userService);
                result = roles;
            }
            catch (Exception e)
            {
                Console.Out.WriteLine(e);
                return Results.Problem(e.ToString());
            }

            return Results.Ok(result);
        })
        .WithCommonOpenApi();

        return app;
    }
}
