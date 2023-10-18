using foozApi.DTO;
using foozApi.Models;
using foozApi.Services;
using foozApi.Storage;
using Microsoft.AspNetCore.Mvc;

namespace foozApi.Endpoints;

public static class TournamentEndpoints
{
    private static RouteHandlerBuilder WithCommonOpenApi(this RouteHandlerBuilder builder)
    {
        return builder
            .WithTags("Tournament")
            .WithOpenApi();
    }

    public static WebApplication AddTournamentEndpoints(this WebApplication app)
    {
        var storageService = app.Services.GetRequiredService<TableStorage>();
        var tournamentService = app.Services.GetRequiredService<TournamentService>();
        var liveUpdater = app.Services.GetRequiredService<LiveUpdateService>();

        app.MapPost("/Tournament", async ([FromBody] PostTournament body) =>
        {
            return await tournamentService.CreateTournament(body);
        })
        .WithName("PostTournament")
        .WithCommonOpenApi();

        app.MapGet("/Tournament/{tournamentId}", async ([FromRoute] string tournamentId) =>
        {
            var result = await storageService.GetTournament(tournamentId);
            if (result == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(result);
        })
        .WithName("Get Tournament")
        .Produces<Tournament>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithCommonOpenApi();

        app.MapGet("/Tournaments", async () =>
        {
            var tournaments = await tournamentService.GetTournaments();
            if (tournaments == null)
            {
                return Results.NotFound();
            }
            return Results.Ok(tournaments);
        })
        .WithName("Get all Tournaments")
        .Produces<TournamentsResponse[]>(StatusCodes.Status200OK)
        .Produces(StatusCodes.Status404NotFound)
        .WithCommonOpenApi();
        return app;
    }
}
