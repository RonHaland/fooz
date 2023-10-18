namespace foozApi.DTO;

public class PutTimerUpdate
{
    public TimerUpdate TimerUpdate { get; set; }
    public int Amount { get; set; }
}

public enum TimerUpdate
{
    Start = 1,
    Stop = 2,
    Pause = 3,
    Unpause = 4,
    Edit = 5,
    EditOvertime = 6,
}