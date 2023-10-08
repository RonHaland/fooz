using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class TournamentEntity : ITableEntity
{
    public TournamentEntity(Tournament model)
    {
        PartitionKey = DateTimeOffset.UtcNow.Year.ToString();
        RowKey = model.Id.ToString();

        Name = model.Name;
    }
    public string Name { get; set; }

    public string PartitionKey { get; set; }
    public string RowKey { get; set; }

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
