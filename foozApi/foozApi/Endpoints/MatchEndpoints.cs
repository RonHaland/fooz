using foozApi.DTO;
using foozApi.Models;
using foozApi.Services;
using foozApi.Utils;
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
        var leagueService = app.Services.GetRequiredService<LeagueService>();
        var liveService = app.Services.GetRequiredService<LiveUpdateService>(); 
        var userService = app.Services.GetRequiredService<UserService>();

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

        app.MapPut("/League/{leagueId}/Matches/{matchId}", async ([FromBody] PutMatch putMatch, [FromRoute] string leagueId, string matchId, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            var scores = GetScores(putMatch);
            await leagueService.UpdateMatchScores(leagueId, matchId, scores[0], scores[1]);
            await liveService.SendUpdate(leagueId);

            return Results.Ok();
        })
        .WithName("Update match result")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPut("/League/{leagueId}/Matches/reorder", async ([FromBody] List<UpdateMatchOrderDto> newOrderList, [FromRoute] string leagueId, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            await leagueService.UpdateMatchOrder(leagueId, newOrderList);
            await liveService.SendUpdate(leagueId);

            return Results.Ok();
        })
        .WithName("Update match order")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapGet("/League/{leagueId}/Matches/{matchId}", async ([FromRoute] string leagueId, string matchId) =>
        {
            var currentMatch = await leagueService.GetMatch(leagueId, matchId);
            if (currentMatch == null)
            {
                return Results.NotFound(currentMatch);
            }

            return Results.Ok(currentMatch);
        })
        .WithName("Get Match by Id")
        .Produces<Match>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
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
