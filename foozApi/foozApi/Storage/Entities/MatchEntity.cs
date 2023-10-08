using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class MatchEntity : ITableEntity
{
    public MatchEntity(Match model) 
    {
        PartitionKey = model.RoundId;
        RowKey = model.Id.ToString();

        Team1Id = model.Team1.Id.ToString();
        Team1Score = model.Team1.Score;
        Team2Id = model.Team2.Id.ToString();
        Team2Score = model.Team2.Score;
    }

    public string Team1Id { get; set; }
    public int Team1Score { get; set; }
    public string Team2Id { get; set; }
    public int Team2Score { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
