using foozApi.DTO;
using foozApi.Models;
using foozApi.OldModels;
using foozApi.Services;
using foozApi.Storage;
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
        var storageService = app.Services.GetRequiredService<TableStorage>();
        var leagueService = app.Services.GetRequiredService<LeagueService>();
        var liveUpdater = app.Services.GetRequiredService<LiveUpdateService>();

        app.MapGet("/League/MatchCountOptions", (int playerCount) =>
        {
            return leagueService.PossibleMatchCounts(playerCount);
        })
        .WithName("Get match count options")
        .WithCommonOpenApi();

        app.MapPost("/League", async ([FromBody] PostLeague body) =>
        {
            return await leagueService.CreateLeague(body.Name, body.Players, body.MatchCount);
        })
        .WithName("Post League")
        .WithCommonOpenApi();

        app.MapGet("/League/{tournamentId}", async ([FromRoute] string tournamentId) =>
        {
            var result = await leagueService.GetLeague(tournamentId);
            if (result == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(result);
        })
        .WithName("Get League")
        //.Produces<League>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithCommonOpenApi();

        app.MapGet("/Leagues", async () =>
        {
            var tournaments = await leagueService.GetLeagues();
            if (tournaments == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(tournaments);
        })
        .WithName("Get all Leagues")
        .Produces<TournamentsResponse[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithCommonOpenApi();
        return app;
    }
}
