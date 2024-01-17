using AzureTableContext;
using foozApi.DTO;
using foozApi.OldModels;
using System.Diagnostics;

namespace foozApi.Storage;

public class TableStorage
{
    private readonly TableContext _tableContext;

    public TableStorage(TableContext tableContext)
    {
        _tableContext = tableContext;
    }

    public async Task AddTournament(Tournament tournament)
    {
        await _tableContext.Save(tournament);
    }

    public async Task<Tournament?> GetTournament(string tournamentId)
    {
        var sw = new Stopwatch();
        sw.Start();
        var tournamentsResult = await _tableContext.QueryAsync<Tournament>($"RowKey eq '{tournamentId}'");
        if (tournamentsResult == null || !tournamentsResult.Any())
        {
            return null;
            //Not found
        }
        Console.WriteLine("1: {0}", sw.ElapsedMilliseconds);

        var tournament = tournamentsResult.FirstOrDefault();
        var teams = tournament?.Rounds?.SelectMany(r => r.Teams).ToDictionary(k => k.Id, v => v) ?? [];

        foreach (var match in tournament.Rounds.SelectMany(r => r.Matches))
        {
            var team1id = match.Team1.Id;
            match.Team1 = teams.TryGetValue(team1id, out var team1) ? team1 : null;

            var team2id = match.Team2.Id;
            match.Team2 = teams.TryGetValue(team2id, out var team2) ? team2 : null;
        }

        return tournament;
    }

    public async Task<IEnumerable<Match>?> GetMatches(string tournamentId)
    {
        var tournament = await GetTournament(tournamentId);
        return tournament?.Rounds?.SelectMany(r => r.Matches).OrderBy(m => m.Round.RoundNumber).ThenBy(m => m.MatchNumber).ToList();
    }

    public async Task<IEnumerable<Match>?> GetMatchesAsync(string tournamentId)
    {
        var matchQuery = $"PartitionKey gt '{tournamentId}' and PartitionKey lt '{tournamentId}a'";

        var matches = await _tableContext.QueryAsync<Match>(matchQuery);
        if (matches == null) { return null; }

        matches = matches.OrderBy(m => m.RoundNumber).ThenBy(m => m.MatchNumber);

        return matches.ToList();
    }

    public async Task<TournamentsResponse[]?> GetTournamentsList()
    {
        var tournamentResult = await _tableContext.QueryAsync<Tournament>("", 0);
        if (tournamentResult == null) { return null; }
        var tournaments = tournamentResult
            .OrderByDescending(t => t.ModifiedDate)
            .Take(100)
            .ToList();

        var response = tournaments.Select(t => new TournamentsResponse
        {
            Name = t.Name,
            Id = t.Id,
            Time = t.ModifiedDate ?? default,
        }).ToArray();

        return response;
    }

    public async Task UpdateMatchScore(string tournamentId, string matchId, int team1Score, int team2Score)
    {
        var MatchQuery = $"PartitionKey ge '{tournamentId}' and PartitionKey lt '{tournamentId}a' and RowKey eq '{matchId}'";
        var existingMatchResult = await _tableContext.QueryAsync<Match>(MatchQuery);
        if (existingMatchResult == null)
        {
            return;
        }
        var existingMatch = existingMatchResult.First();
        existingMatch.Team1Score = team1Score;
        existingMatch.Team2Score = team2Score;
        existingMatch.IsCompleted = true;
        await _tableContext.Save(existingMatch);
    }
}
