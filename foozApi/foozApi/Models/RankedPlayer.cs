using AzureTableContext.Attributes;

namespace foozApi.Models;

[TableName("RankedPlayers")]
public class RankedPlayer : Player
{
    public int Rating { get; set; }
}
