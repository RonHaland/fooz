using System.Text.Json.Serialization;

namespace foozApi.DTO;

public class PutMatch
{
    public int WinningTeam { get; set; }
    public WinType WinType { get; set; }
}

public enum WinType
{
    Draw = 0,
    Time = 1,
    Score = 2,
}
