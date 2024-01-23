using Azure.Core;
using foozApi.DTO;
using foozApi.Models;
using foozApi.Services;
using foozApi.Utils;
using Microsoft.AspNetCore.Mvc;

namespace foozApi.Endpoints;

public static class LeagueEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("League")
            .WithOpenApi();
    }

    public static WebApplication AddLeagueEndpoints(this WebApplication app)
    {
        var leagueService = app.Services.GetRequiredService<LeagueService>();
        var userService = app.Services.GetRequiredService<UserService>();

        app.MapGet("/League/MatchCountOptions", (int playerCount) =>
        {
            if (playerCount < 4) {
                return [];    
            }
            return leagueService.PossibleMatchCounts(playerCount);
        })
        .WithName("Get match count options")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapPost("/League", async ([FromBody] PostLeague body, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            return await leagueService.CreateLeague(body.Name, body.Players, body.MatchCount);
        })
        .WithName("Post League")
        .Produces<League>(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        app.MapGet("/League/{id}", async ([FromRoute] string id) =>
        {
            var result = await leagueService.GetLeague(id);
            if (result == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(result);
        })
        .WithName("Get League")
        .Produces<League>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithCommonOpenApi();

        app.MapGet("/Leagues", async () =>
        {
            var leagues = await leagueService.GetLeagues();
            if (leagues == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(leagues.OrderByDescending(l => l.ModifiedDate).Select(l => new LeaguesResponse
            {
                Id = l.Id,
                MatchCount = l.Matches.Count,
                PlayerCount = l.Players.Count,
                Name = l.Name,
                Time = l.ModifiedDate
            }));
        })
        .WithName("Get all Leagues")
        .Produces<LeaguesResponse[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
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

        app.MapDelete("/League/{id}", async (string id, HttpRequest request) =>
        {
            if (!await request.IsAdmin(userService)) throw new UnauthorizedAccessException();
            await leagueService.DeleteLeague(id);
        })
        .WithName("Delete League")
        .Produces(StatusCodes.Status200OK)
        .WithCommonOpenApi();

        return app;
    }
}
