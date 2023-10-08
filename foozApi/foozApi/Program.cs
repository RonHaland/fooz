using foozApi.DTO;
using foozApi.Services;
using foozApi.Storage;
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
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();
