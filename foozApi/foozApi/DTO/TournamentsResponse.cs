namespace foozApi.DTO;

public class TournamentsResponse
{
    public string Name { get; set; } = null!;
    public string Id { get; set; } = null!;
    public DateTimeOffset Time { get; set; }
}
