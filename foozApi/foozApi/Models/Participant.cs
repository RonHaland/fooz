using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Participant
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public int Score { get; set; } = 0;
    public int Weigth { get; set; } = 5;
    [JsonIgnore]
    public Tournament Tournament { get; set; } = null!;
    [JsonIgnore]
    public IEnumerable<Team> Teams { get; set; } = Enumerable.Empty<Team>();
}
