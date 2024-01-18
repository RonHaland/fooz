namespace foozApi.DTO;

public class LeaguesResponse
{
    public string Name { get; set; } = null!;
    public string Id { get; set; } = null!;
    public int MatchCount { get; set; }
    public int PlayerCount { get; set; }
    public DateTimeOffset? Time { get; set; }
}
