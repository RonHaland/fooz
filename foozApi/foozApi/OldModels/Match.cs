using AzureTableContext;
using AzureTableContext.Attributes;
using System.Text.Json.Serialization;

namespace foozApi.OldModels;

[TableName("Matches")]
public class Match : TableModel
{
    public Match() { }

    public int MatchNumber { get; set; } = 0;
    [TableIgnore]
    public int RoundNumber => Round.RoundNumber;
    [TableParent]
    [JsonIgnore]
    public Round Round { get; set; } = null!;
    public bool IsCompleted { get; set; } = false;

    [TableForeignKey]
    public Team Team1 { get; set; } = null!;
    public int Team1Score { get; set; } = 0;
    [TableForeignKey]
    public Team Team2 { get; set; } = null!;
    public int Team2Score { get; set; } = 0;
}