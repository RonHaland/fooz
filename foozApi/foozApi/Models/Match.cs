using TableWorm;
using TableWorm.Attributes;

namespace foozApi.Models;

[TableName("Matches")]
public class Match : TableModel
{
    [TableForeignKey]
    public Player Team1Player1 { get; set; } = null!;
    [TableForeignKey]
    public Player Team1Player2 { get; set; } = null!;
    public int Team1Score { get; set; }
    [TableForeignKey]
    public Player Team2Player1 { get; set; } = null!;
    [TableForeignKey]
    public Player Team2Player2 { get; set; } = null!;
    public int Team2Score { get; set; }

    public bool IsCompleted { get; set; } = false;
    public int Order { get; set; } = 0;
    [TableIgnore]
    public List<Player> Players => [ Team1Player1, Team1Player2, Team2Player1, Team2Player2 ];
}