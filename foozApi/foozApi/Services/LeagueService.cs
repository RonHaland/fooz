﻿using foozApi.DTO;
using foozApi.Models;
using foozApi.Utils;
using TableWorm;

namespace foozApi.Services;

public sealed class LeagueService
{
    private readonly TableStorage _tableStorage;

    public LeagueService(TableStorage tableStorage)
    {
        _tableStorage = tableStorage;
    }

    public async Task<League> CreateLeague(string leagueName, List<string> names, int matchCount)
    {
        if (names.Count < 4)
        {
            throw new ArgumentException("minimum 4 players required");
        }
        if (!GetOptions(names.Count).Contains(matchCount))
        {
            var options = string.Join(", ", GetOptions(names.Count));
            throw new ArgumentException($"matchCount parameter must be one of [{options}]");
        }

        var counters = names.OrderBy(n => Random.Shared.Next(100)).ToDictionary(k => new Player { Name = k }, v => new { count = 0, front = 0, back = 0 });

        var matches = new List<Match>();
        int count = 0;

        while (matches.Count < matchCount)
        {
            if (counters.Any(c => c.Value.count > 100)) break;
            var frontPlayers = counters
                .OrderBy(c => c.Value.count)
                .ThenBy(c => c.Value.front)
                .ThenBy(n => Random.Shared.Next(100))
                .Take(2).ToList();
            var backPlayers = counters
                .Where(c => !frontPlayers.Any(f => f.Key == c.Key))
                .OrderBy(c => c.Value.count)
                .ThenBy(c => c.Value.back)
                .ThenBy(c => c.Key.MatchCountWith(frontPlayers.First().Key, matches))
                .ThenBy(c => c.Key.MatchCountWith(frontPlayers.Last().Key, matches))
                .ThenBy(n => Random.Shared.Next(100))
                .Take(2).ToList();

            var selected = frontPlayers.Concat(backPlayers).ToList();

            var match = new Match
            {
                Team1Player1 = frontPlayers.First().Key,
                Team1Player2 = backPlayers.First().Key,
                Team2Player1 = frontPlayers.Skip(1).First().Key,
                Team2Player2 = backPlayers.Skip(1).First().Key,
                Order = count,
            };

            matches.Add(match);
            foreach (var item in selected)
            {
                var current = counters[item.Key];
                var isFront = item.Key == match.Team1Player1 || item.Key == match.Team2Player1;
                counters[item.Key] = new { count = current.count+1, front = isFront ? current.front + 1 : current.front , back = !isFront ? current.back + 1 : current.back };
            }
            count++;
        }

        var players = counters.Select(c => c.Key).ToList();
        FillPlayerMatches(matches, players);

        var league = new League
        {
            Name = leagueName,
            PartitionKey = $"{DateTime.UtcNow:yyyy-MM}",
            Players = players,
            Matches = matches,
        };

        await _tableStorage.Save(league);

        return league;
    }

    private static void FillPlayerMatches(List<Match> matches, List<Player> players)
    {
        foreach (var player in players)
        {
            player.Matches = matches.Where(m => m.Players.Select(p => p.Id).Contains(player.Id)).ToList();
        }
    }

    public async Task<List<League>> GetLeagues()
    {
        var leagues = await _tableStorage.QueryAsync<League>("", 1);

        return leagues?.ToList() ?? [];
    }

    public async Task<League?> GetLeague(string id)
    {
        var leagues = await _tableStorage.QueryAsync<League>($"RowKey eq '{id}'");
        var league = leagues?.FirstOrDefault();
        if (league == null) return null;
        league.Matches = league.Matches.OrderBy(m => m.Order).ToList();
        FillPlayerMatches(league.Matches, league.Players);
        return league;
    }

    public async Task DeleteLeague(string id)
    {
        var leagues = await _tableStorage.QueryAsync<League>($"RowKey eq '{id}'");
        var league = leagues?.FirstOrDefault();
        if (league == null) return;
        await _tableStorage.Delete(league, 3);
    }


    public async Task<Match?> GetMatch(string leagueId, string matchId)
    {
        var matchQuery = $"RowKey eq '{matchId}' and PartitionKey eq '{leagueId}'";
        var matches = await _tableStorage.QueryAsync<Match>(matchQuery);
        var match = matches?.FirstOrDefault();
        return match;
    }

    public async Task<IEnumerable<Match>> GetMatches(string id)
    {
        var tournament = await GetLeague(id);

        return tournament?.Matches ?? [];
    }

    public async Task<LeagueProgressResponse> GetLeagueProgress(string id)
    {
        var matches = await GetMatches(id);
        var response = new LeagueProgressResponse
        {
            CurrentMatch = matches.FirstOrDefault(m => !m.IsCompleted),
            UpcomingMatches = matches.Where(m => !m.IsCompleted).Skip(1).ToList(),
            CompletedMatches = matches.Where(m => m.IsCompleted).ToList(),
        };
        return response;
    }

    public async Task UpdateMatchScores(string tournamentId, string matchId, int team1Score, int team2Score)
    {
        var MatchQuery = $"PartitionKey ge '{tournamentId}' and PartitionKey lt '{tournamentId}a' and RowKey eq '{matchId}'";
        var matches = _tableStorage.Query<Match>(MatchQuery);
        var match = matches?.FirstOrDefault();
        if (match == null) return;

        match.Team1Score = team1Score;
        match.Team2Score = team2Score;
        match.IsCompleted = true;
        await _tableStorage.Save(match);
    }

    public async Task UpdateMatchOrder(string tournamentId, List<UpdateMatchOrderDto> newOrderList)
    {
        var newOrderDictionary = newOrderList.ToDictionary(n => n.Id, n => n.Order);
        var matches = await GetMatches(tournamentId);
        foreach (var match in matches) 
        {
            match.Order = newOrderDictionary.TryGetValue(match.Id, out var order) ? order : match.Order;
        }

        await _tableStorage.Save(matches.ToArray());
    }

    public List<int> PossibleMatchCounts(int playerCount, int maxGames = 100) => GetOptions(playerCount, maxGames);

    private List<int> GetOptions(int count, int max = 100) => Enumerable.Range(1, max).Where(n => count * n % 4 == 0 && count * n / 4 <= max).Select(n => (n * count) / 4 ).ToList();

}
