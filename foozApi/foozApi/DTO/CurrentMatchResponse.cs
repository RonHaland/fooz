using foozApi.OldModels;

namespace foozApi.DTO;

public class CurrentMatchResponse
{
    public Match? CurrentMatch { get; set; }
    public Match? PreviousMatch { get; set; }
    public Match? NextMatch { get; set; }
    public bool IsComplete { get; set; }
}
