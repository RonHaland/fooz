using AzureTableContext;
using AzureTableContext.Attributes;
using System.Text.Json.Serialization;

namespace foozApi.OldModels;

[TableName("Rounds")]
public class Round : TableModel
{
    public Round()
    {
    }

    [TableParent]
    [JsonIgnore]
    public Tournament Tournament { get; set; } = null!;
    public int RoundNumber { get; set; } = 0;
    [TableIgnore]
    public bool IsCompleted => Matches.All(m => m.IsCompleted);
    [TableComboKey]
    public List<Match> Matches { get; set; } = [];
    [TableComboKey]
    [JsonIgnore]
    public List<Team> Teams { get; set; } = [];
}
