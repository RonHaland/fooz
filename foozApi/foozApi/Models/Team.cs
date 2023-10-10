using foozApi.Storage.Entities;
using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Team
{
    public Team()
    {
        
    }
    public Team(TeamEntity entity, IDictionary<string, Round> roundDictionary, IDictionary<string, Participant> playerDictionary)
    {
        Id = Guid.Parse(entity.RowKey);
        Round = roundDictionary[entity.PartitionKey];
        Player1 = playerDictionary[entity.Player1Id];
        Player2 = playerDictionary[entity.Player2Id];
    }
    public Guid Id { get; set; } = Guid.NewGuid();
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    [JsonIgnore]
    public Round Round { get; set; } = null!;

    public Participant Player1 { get; set; } = null!;
    public Participant Player2 { get; set; } = null!;
    public int Score { get; set; } = 0;
}
