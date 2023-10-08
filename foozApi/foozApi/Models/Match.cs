﻿using System.Text.Json.Serialization;

namespace foozApi.Models;

public class Match
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string RoundId => $"{Round.Tournament.Id}_{Round.RoundNumber}";
    [JsonIgnore]
    public Round Round { get; set; } = null!;

    public Team Team1 { get; set; } = null!;
    public int Team1Score { get; set; } = 0;
    public Team Team2 { get; set; } = null!;
    public int Team2Score { get; set; } = 0;
}