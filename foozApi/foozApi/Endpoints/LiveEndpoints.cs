using foozApi.DTO;
using foozApi.Services;
using foozApi.Storage;
using Microsoft.AspNetCore.Mvc;

namespace foozApi.Endpoints;

public static class LiveEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("Live")
            .WithOpenApi();
    }
    public static WebApplication AddLiveEndpoints(this WebApplication app)
    {
        var storageService = app.Services.GetRequiredService<TableStorage>();
        var tournamentService = app.Services.GetRequiredService<TournamentService>();
        var liveUpdater = app.Services.GetRequiredService<LiveUpdateService>();

        app.Map("/Tournament/{tournamentId}/live", async (string tournamentId, HttpContext context) =>
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                var socket = await context.WebSockets.AcceptWebSocketAsync();
                await liveUpdater.ConnectClient(socket, tournamentId);
            }
        })
        .WithName("Live Websocket Connection")
        .WithCommonOpenApi();

        app.MapPut("/Tournament/{tournamentId}/live/timer", async ([FromBody] PutTimerUpdate putTimerUpdate, string tournamentId) =>
        {
            await liveUpdater.SendTimerUpdate(tournamentId, putTimerUpdate.TimerUpdate, putTimerUpdate.Amount);
        })
        .WithName("Send Timer Update")
        .WithCommonOpenApi();

        return app;
    }
}
