using foozApi.Models;

namespace foozApi.DTO;

public class CurrentMatchResponse
{
    public Match CurrentMatch { get; set; } = null!;
    public Match? PreviousMatch { get; set; }
    public Match? NextMatch { get; set; }
}
