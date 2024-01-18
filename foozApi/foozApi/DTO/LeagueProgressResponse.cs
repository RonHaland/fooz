using foozApi.Models;

namespace foozApi.DTO;

public class LeagueProgressResponse
{
    public Match? CurrentMatch { get; set; }
    public List<Match> CompletedMatches { get; set; } = [];
    public List<Match> UpcomingMatches { get; set; } = [];
    public bool IsComplete => CurrentMatch == null;
}
