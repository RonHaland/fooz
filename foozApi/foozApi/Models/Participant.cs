using foozApi.Storage.Entities;
using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Participant
{
    public Participant()
    {
        
    }

    public Participant(ParticipantEntity entity)
    {
        Id = Guid.Parse(entity.RowKey);
        Name = entity.Name;
        Score = entity.Score;
        Weigth = entity.Weight;
    }

    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public int Score { get; set; } = 0;
    public int Weigth { get; set; } = 5;
    [JsonIgnore]
    public Tournament Tournament { get; set; } = null!;
    [JsonIgnore]
    public IEnumerable<Team> Teams { get; set; } = Enumerable.Empty<Team>();
}
