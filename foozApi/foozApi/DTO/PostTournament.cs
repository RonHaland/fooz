namespace foozApi.DTO;

public class PostTournament
{
    public string Name { get; set; } = Guid.NewGuid().ToString();
    public int RoundCount { get; set; } = 3;
    public ParticipantDto[] Participants { get; set; } = { };
}

public class ParticipantDto
{
    public string Name { get; set; } = null!;
    public int Weight { get; set; } = 5;
}