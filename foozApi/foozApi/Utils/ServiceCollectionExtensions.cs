using AzureTableContext;
using foozApi.Models;

namespace foozApi.Utils;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddTableContext(this IServiceCollection services, IConfiguration config)
    {
        var tableContext = new TableContext();
        var connstr = config.GetValue<string>("TableConnectionString")!;
        tableContext
                .ConfigureConnectionString(connstr)
                .RegisterTable<User>()
                .RegisterTable<League>()
                .RegisterTable<Models.Match>()
                .RegisterTable<Player>();

        return services.AddSingleton(tableContext);
    }
}
