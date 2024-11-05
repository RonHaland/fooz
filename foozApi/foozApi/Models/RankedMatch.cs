using TableWorm;
using TableWorm.Attributes;

namespace foozApi.Models;

[TableName("RankedMatches")]
public class RankedMatch : TableModel
{
    [TableForeignKey]
    public RankedPlayer Team1Player1 { get; set; } = null!;
    [TableForeignKey]
    public RankedPlayer Team1Player2 { get; set; } = null!;
    public int Team1Score { get; set; }

    [TableForeignKey]
    public RankedPlayer Team2Player1 { get; set; } = null!;
    [TableForeignKey]
    public RankedPlayer Team2Player2 { get; set; } = null!;
    public int Team2Score { get; set; }

    public bool IsCompleted { get; set; } = false;

    [TableIgnore]
    public List<RankedPlayer> Players => [ Team1Player1, Team1Player2, Team2Player1, Team2Player2 ];
}