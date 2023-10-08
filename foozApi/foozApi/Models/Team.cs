using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Team
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    [JsonIgnore]
    public Round Round { get; set; } = null!;

    public Participant Player1 { get; set; } = null!;
    public Participant Player2 { get; set; } = null!;
    public int Score { get; set; } = 0;
}
