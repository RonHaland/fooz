using AzureTableContext;
using foozApi.Models;

namespace foozApi.Services;

public class LeagueService
{
    private readonly TableContext _tableContext;

    public LeagueService(TableContext tableContext)
    {
        _tableContext = tableContext;
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

        var counters = names.OrderBy(n => Random.Shared.Next(100)).ToDictionary(k => new Player { Name = k }, v => 0);

        var matches = new List<Match>();

        while (matches.Count < matchCount)
        {
            if (counters.Any(c => c.Value > 100)) break;
            var selected = counters.OrderBy(c => c.Value).ThenBy(n => Random.Shared.Next(100)).Take(4).ToList();

            var match = new Match
            {
                Team1Player1 = selected.First().Key,
                Team1Player2 = selected.Skip(1).First().Key,
                Team2Player1 = selected.Skip(2).First().Key,
                Team2Player2 = selected.Skip(3).First().Key,
            };

            matches.Add(match);
            foreach (var item in selected)
            {
                counters[item.Key]++;
            }
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

        await _tableContext.Save(league);

        return league;
    }

    private static void FillPlayerMatches(List<Match> matches, List<Player> players)
    {
        foreach (var player in players)
        {
            player.Matches = matches.Where(m => m.Players.Contains(player)).ToList();
        }
    }

    public async Task<List<League>> GetLeagues()
    {
        var leagues = await _tableContext.QueryAsync<League>("", 0);

        return leagues?.ToList() ?? [];
    }

    public async Task<List<League>> GetLeague(string id)
    {
        var leagues = await _tableContext.QueryAsync<League>($"RowKey eq '{id}'");
        var league = leagues?.FirstOrDefault();
        if (league == null) return [];
        FillPlayerMatches(league.Matches, league.Players);
        return leagues?.ToList() ?? [];
    }

    public List<int> PossibleMatchCounts(int playerCount, int maxGames = 100) => GetOptions(playerCount, maxGames);

    private List<int> GetOptions(int count, int max = 100) => Enumerable.Range(4, max).Where(n => count * n % 4 == 0 && count * n / 4 <= max).Select(n => n * count / 4).ToList();
}
