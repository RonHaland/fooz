using foozApi.Storage.Entities;
using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Team
{
    public Team()
    {
        Id = Guid.NewGuid();
    }
    public Team(TeamEntity entity, IDictionary<string, Round> roundDictionary, IDictionary<string, Participant> playerDictionary)
    {
        Id = Guid.Parse(entity.RowKey);
        Round = roundDictionary[entity.PartitionKey];
        Player1 = playerDictionary[entity.Player1Id];
        Player2 = playerDictionary[entity.Player2Id];
    }
    public Guid Id { get; set; }
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    [JsonIgnore]
    public Round Round { get; set; } = null!;

    [JsonIgnore]
    public IEnumerable<Match> HomeMatches { get; set; } = Enumerable.Empty<Match>();
    [JsonIgnore]
    public IEnumerable<Match> AwayMatches { get; set; } = Enumerable.Empty<Match>();

    public Participant Player1 { get; set; } = null!;
    public Participant Player2 { get; set; } = null!;
    public int Score => CalculateScore();

    private int CalculateScore()
    {
        return HomeMatches.Sum(m => m.Team1Score) + AwayMatches.Sum(m => m.Team2Score);
    }
}
