using foozApi.Endpoints;
using foozApi.Services;
using foozApi.Storage;
using foozApi.Utils;
using Microsoft.AspNetCore.Http.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddSingleton<TableStorage>();
builder.Services.AddSingleton<TournamentService>();
builder.Services.AddSingleton<LeagueService>();
builder.Services.AddSingleton<LiveUpdateService>();
builder.Services.AddSingleton<UserService>();

builder.Services.AddTableContext(builder.Configuration);

builder.Services.Configure<JsonOptions>(opt =>
{
    opt.SerializerOptions.PropertyNameCaseInsensitive = false;
    var converter = new JsonStringEnumConverter();
    opt.SerializerOptions.Converters.Add(converter);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseWebSockets();

app.AddMatchEndpoints();
app.AddLeagueEndpoints();
app.AddLiveEndpoints();
app.AddUserEndpoints();

app.UseCors(c => c.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader());

app.Run();
