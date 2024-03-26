using foozApi.Endpoints;
using foozApi.Exceptions;
using foozApi.Services;
using foozApi.Utils;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using static System.Net.Mime.MediaTypeNames;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
});
builder.Services.AddCors();

builder.Services.AddSingleton<LeagueService>();
builder.Services.AddSingleton<LiveUpdateService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<RankedService>();

builder.Services.AddTableContext(builder.Configuration);

builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(opt =>
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

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;

        // using static System.Net.Mime.MediaTypeNames;
        context.Response.ContentType = Text.Plain;

        await context.Response.WriteAsync("An error occurred");

        var exceptionHandlerPathFeature =
            context.Features.Get<IExceptionHandlerPathFeature>();

        if (exceptionHandlerPathFeature?.Error is NotFoundException)
        {
            context.Response.StatusCode = StatusCodes.Status404NotFound;
            await context.Response.WriteAsync("Resource not found");
        }

        if (exceptionHandlerPathFeature?.Error is InvalidOperationException IOE)
        {
            await context.Response.WriteAsync(IOE.Message);
        }

        if (exceptionHandlerPathFeature?.Error is ArgumentException AE)
        {
            await context.Response.WriteAsync(AE.Message);
        }
    });
});

app.AddMatchEndpoints();
app.AddLeagueEndpoints();
app.AddLiveEndpoints();
app.AddUserEndpoints();
app.AddMRankedEndpoints();

app.UseCors(c => c.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader());

app.Run();
