using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class RoundEntity : ITableEntity
{
    public RoundEntity() { }
    public RoundEntity(Round model)
    {
        PartitionKey = model.Tournament.Id.ToString();
        RowKey = model.RoundNumber.ToString();
    }

    public string PartitionKey { get; set; } = null!;
    public string RowKey { get; set; } = null!;

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}