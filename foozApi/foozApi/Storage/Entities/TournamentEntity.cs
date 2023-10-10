﻿using Azure;
using Azure.Data.Tables;
using foozApi.Models;

namespace foozApi.Storage.Entities;

public class TournamentEntity : ITableEntity
{
    public TournamentEntity() { }
    public TournamentEntity(Tournament model)
    {
        PartitionKey = DateTimeOffset.UtcNow.Year.ToString();
        RowKey = model.Id.ToString();

        Name = model.Name;
        RoundCount = model.Rounds.Count();
    }
    public string Name { get; set; } = null!;
    public int RoundCount { get; set; }

    public string PartitionKey { get; set; } = null!;
    public string RowKey { get; set; } = null!;

    public DateTimeOffset? Timestamp { get; set; }
    public ETag ETag { get; set; }
}
