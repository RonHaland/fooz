using foozApi.Storage.Entities;
using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Match
{
    public Match() {}
    public Match(MatchEntity entity, IDictionary<string, Round> roundDictionary, IDictionary<string, Team> teamDictionary)
    {
        Id = Guid.Parse(entity.RowKey);
        MatchNumber = entity.MatchNumber;
        Round = roundDictionary[entity.PartitionKey];
        IsCompleted = entity.IsCompleted;

        Team1 = teamDictionary[entity.Team1Id];
        Team2 = teamDictionary[entity.Team2Id];
        Team1Score = entity.Team1Score;
        Team2Score = entity.Team2Score;
    }
    public Guid Id { get; set; } = Guid.NewGuid();
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    public int MatchNumber { get; set; } = 0;
    [JsonIgnore]
    public Round Round { get; set; } = null!;
    public bool IsCompleted { get; set; } = false;

    public Team Team1 { get; set; } = null!;
    public int Team1Score { get; set; } = 0;
    public Team Team2 { get; set; } = null!;
    public int Team2Score { get; set; } = 0;
}