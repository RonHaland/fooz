using foozApi.DTO;
using foozApi.Models;
using foozApi.Services;
using foozApi.Utils;
using Microsoft.AspNetCore.Mvc;

namespace foozApi.Endpoints;

public static class RankedEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("Ranked")
            .WithOpenApi();
    }

    public static WebApplication AddMRankedEndpoints(this WebApplication app)
    {
        var rankedService = app.Services.GetRequiredService<RankedService>();
        var liveService = app.Services.GetRequiredService<LiveUpdateService>(); 
        var userService = app.Services.GetRequiredService<UserService>();

        app.MapGet("/Ranked/Matches", async () =>
        {
            var result = await rankedService.GetRankedMatches();
            if (result == null || !result.Any())
            {
                return Results.NotFound();
            }
            return Results.Ok(result);
        })
        .Produces<RankedMatch[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithName("Get Ranked Matches")
        .WithCommonOpenApi();

        app.MapGet("/Ranked/Match/{id}", (string id) =>
        {
            var result = rankedService.GetRankedMatch(id);
            if (result == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(result);
        })
        .Produces<RankedMatch>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithName("Get Ranked Match")
        .WithCommonOpenApi();

        app.MapPut("/Ranked/Matches/{matchId}", async ([FromBody] PutMatch putMatch, string matchId, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            await rankedService.CompleteMatch(matchId, putMatch.WinningTeam);
            await liveService.SendUpdate(matchId);

            return Results.Ok();
        })
        .WithName("Set ranked match result")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPost("/Ranked/Match", async ([FromBody] PostRankedMatch match, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            var createdMatch = await rankedService.CreateMatch(match.PlayerIds);

            return Results.Ok(createdMatch.Id);
        })
        .WithName("Create Ranked Match")
        .Produces<string>(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPost("/Ranked/Match/Custom", async ([FromBody] PostCustomRankedMatch match, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            var createdMatch = await rankedService.CreateCustomMatch(match.Team1PlayerIds, match.Team2PlayerIds);

            return Results.Ok(createdMatch.Id);
        })
        .WithName("Create Custom Ranked Match")
        .Produces<string>(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPost("/Ranked/Player", async ([FromBody] string name, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            await rankedService.CreateRankedPlayer(name);

            return Results.Ok();
        })
        .WithName("Create Ranked Player")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapGet("/Ranked/Players", async () =>
        {
            var result = await rankedService.GetRankedPlayers();
            if (result == null || !result.Any())
            {
                return Results.NotFound(result);
            }
            return Results.Ok(result);
        })
        .Produces<RankedPlayer[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithName("Get Ranked Players")
        .WithCommonOpenApi();

        //app.MapGet("/League/{leagueId}/Matches/{matchId}", async ([FromRoute] string leagueId, string matchId) =>
        //{
        //    var currentMatch = await rankedService.GetMatch(leagueId, matchId);
        //    if (currentMatch == null)
        //    {
        //        return Results.NotFound(currentMatch);
        //    }

        //    return Results.Ok(currentMatch);
        //})
        //.WithName("Get Match by Id")
        //.Produces<Match>(StatusCodes.Status200OK)
        //.Produces(StatusCodes.Status404NotFound)
        //.WithCommonOpenApi();

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
