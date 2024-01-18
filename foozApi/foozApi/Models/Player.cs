using AzureTableContext;
using AzureTableContext.Attributes;
using System.Text.Json.Serialization;

namespace foozApi.Models;

[TableName("Players")]
public class Player : TableModel
{
    public string Name { get; set; } = null!;
    [TableIgnore, JsonIgnore]
    public List<Match> Matches { get; set; } = [];
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> HomeMatches => Matches.Where(m => m.Team1Player1.Id == Id || m.Team1Player2.Id == Id);
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> AwayMatches => Matches.Where(m => m.Team1Player1.Id == Id || m.Team1Player2.Id == Id);
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> WonMatches => HomeMatches.Where(m => m.IsCompleted && m.Team1Score > m.Team2Score)
                                        .Union(AwayMatches.Where(m => m.IsCompleted && m.Team1Score < m.Team2Score));
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> LostMatches => HomeMatches.Where(m => m.IsCompleted && m.Team1Score < m.Team2Score)
                                        .Union(AwayMatches.Where(m => m.IsCompleted && m.Team1Score > m.Team2Score));
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> DrawnMatches => HomeMatches.Where(m => m.IsCompleted && m.Team1Score == m.Team2Score)
                                        .Union(AwayMatches.Where(m => m.IsCompleted && m.Team1Score == m.Team2Score));
    [TableIgnore, JsonIgnore]
    public IEnumerable<Match> CompletedMatches => Matches.Where(m => m.IsCompleted);
    [TableIgnore]
    public int MatchCount => Matches.Count;
    [TableIgnore]
    public int MatchesPlayed => CompletedMatches.Count();
    [TableIgnore]
    public int Score => HomeMatches.Sum(h => h.Team1Score) + AwayMatches.Sum(a => a.Team2Score);
}
