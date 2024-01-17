namespace foozApi.DTO;

public class PostLeague
{
    public string Name { get; set; } = Guid.NewGuid().ToString();
    public int MatchCount { get; set; } = 3;
    public List<string> Players { get; set; } = [];
}
