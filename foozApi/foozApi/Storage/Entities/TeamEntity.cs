using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class TeamEntity : ITableEntity
{
    public TeamEntity(Team model)
    {
        PartitionKey = model.RoundId.ToString();
        RowKey = model.Id.ToString();

        Score = model.Score;
        Player1Id = model.Player1.Id.ToString();
        Player2Id = model.Player2.Id.ToString();
    }

    public int Score { get; set; }
    public string Player1Id { get; set; }
    public string Player2Id { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
