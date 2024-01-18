using foozApi.DTO;
using foozApi.Models;
using foozApi.OldModels;
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
        var leagueService = app.Services.GetRequiredService<LeagueService>();
        var liveUpdater = app.Services.GetRequiredService<LiveUpdateService>();

        app.MapGet("/League/{id}/Matches", async ([FromRoute] string id) =>
        {
            var result = await leagueService.GetMatches(id);
            if (result == null || !result.Any())
            {
                return Results.NotFound(result);
            }
            return Results.Ok(result);
        })
        .Produces<Models.Match[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithName("Get Matches")
        .WithCommonOpenApi();

        app.MapGet("/League/{id}/Progress", async (string id) =>
        {
            var currentMatch = await leagueService.GetLeagueProgress(id);
            if (currentMatch == null)
            {
                return Results.NotFound(currentMatch);
            }

            return Results.Ok(currentMatch);
        })
        .WithName("Get League Progress")
        .Produces<LeagueProgressResponse>(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPut("/League/{leagueId}/Matches/{matchId}", async ([FromBody] PutMatch putMatch, [FromRoute] string leagueId, string matchId) =>
        {
            var scores = GetScores(putMatch);
            await leagueService.UpdateMatchScores(leagueId, matchId, scores[0], scores[1]);

            return Results.Ok();
        })
        .WithName("Update match result")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapGet("/Tournament/{tournamentId}/Matches", async ([FromRoute] string tournamentId) => 
        {
            var result = await storageService.GetMatchesAsync(tournamentId);
            if (result == null)
            {
                return Results.NotFound(result);
            }
            return Results.Ok(result);
        })
        .WithName("[OLD]Get Matches")
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
        .WithName("[OLD]Update match result")
        .WithCommonOpenApi();

        return app;
    }

    private static int[] GetScores(PutMatch putMatch)
    {
        switch (putMatch.WinType)
        {
            case WinType.Draw:
                return [1, 1];
            case WinType.Time:
                return putMatch.WinningTeam == 1 ? [1, 0] : [0, 1];
            case WinType.Score:
                return putMatch.WinningTeam == 1 ? [2, 0] : [0, 2];
            default:
                return [0,0];
        }
    } 
}
