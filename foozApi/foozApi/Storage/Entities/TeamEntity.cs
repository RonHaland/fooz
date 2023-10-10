using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class TeamEntity : ITableEntity
{
    public TeamEntity() { }
    public TeamEntity(Team model)
    {
        PartitionKey = model.RoundId.ToString();
        RowKey = model.Id.ToString();

        Score = model.Score;
        Player1Id = model.Player1.Id.ToString();
        Player2Id = model.Player2.Id.ToString();
    }

    public int Score { get; set; }
    public string Player1Id { get; set; } = null!;
    public string Player2Id { get; set; } = null!;

    public string PartitionKey { get; set; } = null!;
    public string RowKey { get; set; } = null!;

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
