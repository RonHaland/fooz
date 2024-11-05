using foozApi.Exceptions;
using foozApi.Models;
using TableWorm;

namespace foozApi.Services;

public class RankedService
{
    private readonly TableStorage _tableStorage;

    public RankedService(TableStorage tableStorage)
    {
        _tableStorage = tableStorage;
    }


    public async Task<RankedMatch> CreateMatch(IEnumerable<string> playerIds)
    {
        if (playerIds.Count() != 4) { throw new ArgumentException("Ranked game must have exactly 4 players", nameof(playerIds)); }

        var playerQuery = string.Join(" or ", playerIds.Select(pid => $"RowKey eq '{pid}'"));
        var players = await _tableStorage.QueryAsync<RankedPlayer>(playerQuery);

        if (players == null || players.Count() != 4)
        {
            throw new InvalidOperationException("Unable to find 4 players using the given player Ids");
        }

        var orderedPlayers = players.OrderBy(p => p.Rating).ToList();
        List<RankedPlayer> team1 = [orderedPlayers[0], orderedPlayers[3]];
        List<RankedPlayer> team2 = [orderedPlayers[1], orderedPlayers[2]];

        return await CreateMatch(team1, team2);
    }

    public async Task<RankedMatch> CreateCustomMatch(IEnumerable<string> team1players, IEnumerable<string> team2players)
    {
        if (team1players.Count() != 2 || team2players.Count() != 2) { throw new ArgumentException("Ranked game must have exactly 4 players, 2 on each team"); }
        
        List<string> allPlayersIds = [.. team1players, .. team2players];
        var playerQuery = string.Join(" or ", allPlayersIds.Select(pid => $"RowKey eq '{pid}'"));
        var players = await _tableStorage.QueryAsync<RankedPlayer>(playerQuery);

        if (players == null || players.Count() != 4)
        {
            throw new InvalidOperationException("Unable to find 4 players using the given player Ids");
        }
        List<RankedPlayer> team1 = players.Where(p => team1players.Contains(p.Id)).ToList();
        List<RankedPlayer> team2 = players.Where(p => team2players.Contains(p.Id)).ToList();

        return await CreateMatch(team1, team2);
    }

    public async Task<RankedMatch> CreateMatch(IEnumerable<RankedPlayer> team1players, IEnumerable<RankedPlayer> team2players)
    {

        var team1 = team1players.OrderBy((a) => Random.Shared.Next(0, 3)).ToList();
        var team2 = team2players.OrderBy((a) => Random.Shared.Next(0, 3)).ToList();

        var match = new RankedMatch
        {
            PartitionKey = "RANKED",
            Team1Player1 = team1[0],
            Team1Player2 = team1[1],
            Team2Player1 = team2[0],
            Team2Player2 = team2[1],
        };

        await _tableStorage.Save(match);

        return match;
    }

    public async Task CompleteMatch(string matchId, int winningTeam)
    {
        var match = _tableStorage.Get<RankedMatch>(matchId);
        if (match == null)
            throw new NotFoundException("Match not found");

        List<RankedPlayer> team1 = [match.Team1Player1, match.Team1Player2];
        List<RankedPlayer> team2 = [match.Team2Player1, match.Team2Player2];
        var winners = winningTeam == 1 ? team1 : team2;
        var losers = winningTeam == 2 ? team1 : team2;
        var ratingDiff = losers.Average(l => l.Rating) - winners.Average(w => w.Rating); //positive if winning team is 'weaker'
        AdjustRatings(winners, ratingDiff, true);
        AdjustRatings(losers, ratingDiff, false);

        match.IsCompleted = true;
        match.Team1Score = winningTeam == 1 ? 1 : 0;
        match.Team2Score = winningTeam == 2 ? 1 : 0;

        await _tableStorage.Save(match);
    }

    private void AdjustRatings(List<RankedPlayer> team, double ratingDiff, bool won = true)
    {
        var baseline = Math.Max(2, ((ratingDiff*2) + 450) / 20);
        var fraction0 = team[1].Rating / (double)team[0].Rating;
        var fraction1 = team[0].Rating / (double)team[1].Rating;
        if (won)
        {
            team[0].Rating += (int)(baseline * fraction0);
            team[1].Rating += (int)(baseline * fraction1);
        }
        else
        {
            team[0].Rating -= (int)(baseline * fraction0);
            team[1].Rating -= (int)(baseline * fraction1);
        }
    }

    public async Task<List<RankedMatch>> GetRankedMatches(DateTimeOffset? fromDate = null, DateTimeOffset? toDate = null)
    {
        var query = "";
        if (fromDate != null) query += $"Timestamp > '{fromDate:O}'";
        if (toDate != null) query += $"Timestamp < '{toDate:O}'";

        var matches = await _tableStorage.QueryAsync<RankedMatch>(query);
        if (matches?.Count() > 100)
        {
            matches = matches.OrderBy(x => x.ModifiedDate).Take(100);
        }

        return matches?.ToList() ?? [];
    }

    public RankedMatch? GetRankedMatch(string matchId)
    {
        var match = _tableStorage.Get<RankedMatch>(matchId);
        
        return match;
    }

    public async Task<RankedPlayer> CreateRankedPlayer(string name)
    {
        var player = new RankedPlayer 
        { 
            Name = name, 
            PartitionKey = "RANKED", 
            Rating = 1000,
        };

        await _tableStorage.Save(player);

        return player;
    }

    public async Task<List<RankedPlayer>> GetRankedPlayers()
    {
        var players = await _tableStorage.QueryAsync<RankedPlayer>("");
        return players?.ToList() ?? [];
    }

}
