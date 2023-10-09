using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Round
{
    public string Id => $"{Tournament.Id}_{RoundNumber}";
    [JsonIgnore]
    public Tournament Tournament { get; set; } = null!;
    public int RoundNumber { get; set; } = 0;
    public bool IsCompleted => Matches.All(m => m.IsCompleted);
    public IEnumerable<Match> Matches { get; set; } = Enumerable.Empty<Match>();
    public IEnumerable<Team> Teams { get; set; } = Enumerable.Empty<Team>();
}
