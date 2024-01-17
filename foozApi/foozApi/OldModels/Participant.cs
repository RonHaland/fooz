using AzureTableContext;
using AzureTableContext.Attributes;
using System.Text.Json.Serialization;

namespace foozApi.OldModels;

[TableName("Participants")]
public class Participant : TableModel
{
    public Participant()
    {

    }

    public string Name { get; set; } = null!;
    [TableIgnore]
    public int Score => Teams.Sum(x => x.Score);
    [TableIgnore]
    public int Weigth { get; set; } = 5;
    [TableIgnore]
    public int MatchCount => Teams.Sum(t => t.HomeMatches.Count() + t.AwayMatches.Count());
    [TableIgnore]
    public int MatchesPlayed => Teams.Sum(t => t.HomeMatches.Count(hm => hm.IsCompleted) + t.AwayMatches.Count(am => am.IsCompleted));
    [JsonIgnore]
    [TableParent]
    public Tournament Tournament { get; set; } = null!;
    [TableIgnore]
    [JsonIgnore]
    public IEnumerable<Team> Teams { get; set; } = Enumerable.Empty<Team>();
}
