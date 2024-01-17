using AzureTableContext;
using AzureTableContext.Attributes;

namespace foozApi.Models;

[TableName("Leagues")]
public class League : TableModel
{
    public string Name { get; set; } = null!;
    public List<Player> Players { get; set; } = [];
    public List<Match> Matches { get; set; } = [];
}
