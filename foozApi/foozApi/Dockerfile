#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

ARG HTTP_PORT=8080

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
ARG HTTP_PORT
WORKDIR /app
EXPOSE ${HTTP_PORT}

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG HTTP_PORT
WORKDIR /src
COPY ["foozApi.csproj", "./"]
RUN dotnet restore "foozApi.csproj"
COPY . .
RUN dotnet build "foozApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "foozApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
ARG HTTP_PORT
ENV ASPNETCORE_HTTP_PORTS=${HTTP_PORT}
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "foozApi.dll"]