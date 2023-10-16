using foozApi.DTO;
using foozApi.Services;
using foozApi.Storage;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<TableStorage>();
builder.Services.AddSingleton<TournamentService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

var storageService = app.Services.GetRequiredService<TableStorage>();
var tournamentService = app.Services.GetRequiredService<TournamentService>();

app.MapPost("/Tournament", async ([FromBody] PostTournament body) =>
{
    return await tournamentService.CreateTournament(body);
})
.WithName("PostTournament")
.WithOpenApi();

app.MapGet("/Tournament/{tournamentId}", async ([FromRoute] string tournamentId) =>
{
    var result = await storageService.GetTournament(tournamentId);
    if (result == null)
    {
        return Results.NotFound();
    }
    return Results.Ok(result);
})
.WithName("Get Tournament");

app.MapGet("/Tournament/{tournamentId}/Matches", async ([FromRoute] string tournamentId) => 
{
    var result = await storageService.GetMatchesAsync(tournamentId);
    if (result == null)
    {
        return Results.NotFound(result);
    }
    return Results.Ok(result);
});

app.MapGet("/Tournament/{tournamentId}/CurrentMatch", async ([FromRoute] string tournamentId) =>
{
    var currentMatch = await tournamentService.GetCurrentMatch(tournamentId);
    if (currentMatch == null)
    {
        return Results.NotFound(currentMatch);
    }

    return Results.Ok(currentMatch);
});

app.MapGet("/Tournament/{tournamentId}/Matches/{matchId}", async ([FromRoute] string tournamentId, string matchId) =>
{
    var currentMatch = await tournamentService.GetCurrentMatch(tournamentId, matchId);
    if (currentMatch == null)
    {
        return Results.NotFound(currentMatch);
    }

    return Results.Ok(currentMatch);
});

app.Run();
