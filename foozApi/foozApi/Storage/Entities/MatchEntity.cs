using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class MatchEntity : ITableEntity
{
    public MatchEntity() { }
    public MatchEntity(Match model) 
    {
        PartitionKey = model.RoundId;
        RowKey = model.Id.ToString();

        Team1Id = model.Team1.Id.ToString();
        Team1Score = model.Team1.Score;
        Team2Id = model.Team2.Id.ToString();
        Team2Score = model.Team2.Score;
        MatchNumber = model.MatchNumber;
        RoundNumber = model.RoundNumber;
        IsCompleted = model.IsCompleted;
    }

    public string Team1Id { get; set; } = null!;
    public int Team1Score { get; set; }
    public string Team2Id { get; set; } = null!;
    public int Team2Score { get; set; }
    public int MatchNumber { get; set; }
    public int RoundNumber { get; set; }
    public bool IsCompleted { get; set; }

    public string PartitionKey { get; set; } = null!;
    public string RowKey { get; set; } = null!;

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
