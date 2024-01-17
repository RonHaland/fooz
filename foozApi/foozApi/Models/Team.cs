using AzureTableContext;
using AzureTableContext.Attributes;
using System.Text.Json.Serialization;

namespace foozApi.Models;

[TableName("Teams")]
public class Team : TableModel
{
    public Team()
    {
        Id = Guid.NewGuid().ToString();
    }

    [TableIgnore]
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    [TableParent]
    [JsonIgnore]
    public Round Round { get; set; } = null!;

    [TableIgnore]
    [JsonIgnore]
    public IEnumerable<Match> HomeMatches { get; set; } = Enumerable.Empty<Match>();
    [TableIgnore]
    [JsonIgnore]
    public IEnumerable<Match> AwayMatches { get; set; } = Enumerable.Empty<Match>();

    [TableForeignKey]
    public Participant Player1 { get; set; } = null!;
    [TableForeignKey]
    public Participant Player2 { get; set; } = null!;
    [TableIgnore]
    public int Score => CalculateScore();

    private int CalculateScore()
    {
        return HomeMatches.Sum(m => m.Team1Score) + AwayMatches.Sum(m => m.Team2Score);
    }
}
