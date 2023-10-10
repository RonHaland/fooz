using foozApi.Storage.Entities;

namespace foozApi.Models;

public class Tournament
{
    public Tournament() { }
    public Tournament(TournamentEntity entity)
    {
        Id = Guid.Parse(entity.RowKey);
        Name = entity.Name;
    }
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public IEnumerable<Participant> Participants { get; set; } = Enumerable.Empty<Participant>();
    public IOrderedEnumerable<Round> Rounds { get; set; } = Enumerable.Empty<Round>().Order();
}
