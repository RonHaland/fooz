using foozApi.DTO;
using foozApi.Services;
using foozApi.Storage;
using Microsoft.AspNetCore.Mvc;

namespace foozApi.Endpoints;

public static class MatchEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("Matches")
            .WithOpenApi();
    }
    public static WebApplication AddMatchEndpoints(this WebApplication app)
    {
        var storageService = app.Services.GetRequiredService<TableStorage>();
        var tournamentService = app.Services.GetRequiredService<TournamentService>();
        var liveUpdater = app.Services.GetRequiredService<LiveUpdateService>();

        app.MapGet("/Tournament/{tournamentId}/Matches", async ([FromRoute] string tournamentId) => 
        {
            var result = await storageService.GetMatchesAsync(tournamentId);
            if (result == null)
            {
                return Results.NotFound(result);
            }
            return Results.Ok(result);
        })
        .WithName("Get Matches")
        .WithCommonOpenApi();

        app.MapGet("/Tournament/{tournamentId}/CurrentMatch", async ([FromRoute] string tournamentId) =>
        {
            var currentMatch = await tournamentService.GetCurrentMatch(tournamentId);
            if (currentMatch == null)
            {
                return Results.NotFound(currentMatch);
            }

            return Results.Ok(currentMatch);
        })
        .WithName("Get Current Match")
        .WithCommonOpenApi();

        app.MapGet("/Tournament/{tournamentId}/Matches/{matchId}", async ([FromRoute] string tournamentId, string matchId) =>
        {
            var currentMatch = await tournamentService.GetCurrentMatch(tournamentId, matchId);
            if (currentMatch == null)
            {
                return Results.NotFound(currentMatch);
            }

            return Results.Ok(currentMatch);
        })
        .WithName("Get Match by Id")
        .WithCommonOpenApi();

        app.MapPut("/Tournament/{tournamentId}/Matches/{matchId}", async ([FromBody] PutMatch putMatch, [FromRoute] string tournamentId, string matchId) =>
        {
            await tournamentService.UpdateMatchScore(putMatch, tournamentId, matchId);

            return Results.Ok();
        })
        .WithName("Update match result")
        .WithCommonOpenApi();

        return app;
    }
}
