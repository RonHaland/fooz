using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class ParticipantEntity : ITableEntity
{
    public ParticipantEntity(Participant model)
    {
        PartitionKey = model.Tournament.Id.ToString();
        RowKey = model.Id.ToString();
        Name = model.Name;
        Score = model.Score;
        Weight = model.Weigth;
    }

    public string Name { get; set; }
    public int Score { get; set; }
    public int Weight { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}