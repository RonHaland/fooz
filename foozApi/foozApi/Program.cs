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
    var result = await storageService.GetMatches(tournamentId);
    if (result == null)
    {
        return Results.NotFound(result);
    }
    return Results.Ok(result);
});

app.MapGet("/Tournament/{tournamentId}/CurrentMatch", async ([FromRoute] string tournamentId) =>
{
    var matches = await storageService.GetMatchesAsync(tournamentId);
    if (matches == null)
    {
        return Results.NotFound(matches);
    }

    var matchList = matches.ToList();
    var current = matches.FirstOrDefault(m => !m.IsCompleted);
    if (current == null)
    {
        return Results.NoContent();
    }
    var currentInd = matchList.IndexOf(current);
    var response = new CurrentMatchResponse
    {
        CurrentMatch = current,
        PreviousMatch = currentInd switch
        {
            < 1 => null,
            _ => matchList[currentInd - 1]
        }
    };
    if (currentInd < matchList.Count)
    {
        response.NextMatch = matchList[currentInd+1];
    }

    return Results.Ok(response);
});

app.Run();
