using foozApi.Services;

namespace foozApi.Utils;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection RegisterServices(this IServiceCollection services)
    {
        services.AddSingleton<LeagueService>();
        services.AddSingleton<LiveUpdateService>();
        services.AddSingleton<UserService>();
        services.AddSingleton<RankedService>();

        return services;
    }
}
