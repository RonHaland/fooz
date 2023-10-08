using Azure.Data.Tables;
using foozApi.Storage.Entities;

namespace foozApi.Storage;

public class TableStorage
{
    private TableClient TournamentClient { get; }
    private TableClient MatchClient { get; }
    private TableClient TeamClient { get; }
    private TableClient ParticipantClient { get; }
    private TableClient RoundClient { get; }

    public TableStorage(IConfiguration config)
	{
		var connectionString = config.GetValue<string>("TableConnectionString");

		TournamentClient = new TableClient(connectionString, "Tournaments");
        TournamentClient.CreateIfNotExists();

        MatchClient = new TableClient(connectionString, "Matches");
        MatchClient.CreateIfNotExists();

        TeamClient = new TableClient(connectionString, "Teams");
        TeamClient.CreateIfNotExists();

        ParticipantClient = new TableClient(connectionString, "Participants");
        ParticipantClient.CreateIfNotExists();

        RoundClient = new TableClient(connectionString, "Rounds");
        RoundClient.CreateIfNotExists();
    }

    public async Task AddTournament(Models.Tournament tournament) 
    {
        var tournamentEntity = new TournamentEntity(tournament);
        List<Task<Azure.Response>> tasks = new() 
        {
            TournamentClient.AddEntityAsync(tournamentEntity),
        };

        foreach (var round in tournament.Rounds)
        {
            var roundEntity = new RoundEntity(round);
            tasks.Add(RoundClient.AddEntityAsync(roundEntity));
        }

        var matches = tournament.Rounds.SelectMany(r => r.Matches).ToList();
        foreach (var match in matches)
        {
            var matchEntity = new MatchEntity(match);
            tasks.Add(RoundClient.AddEntityAsync(matchEntity));
        }

        var teams = tournament.Rounds.SelectMany(r => r.Teams).ToList();
        foreach (var team in teams)
        {
            var teamEntity = new TeamEntity(team);
            tasks.Add(RoundClient.AddEntityAsync(teamEntity));
        }

        var participants = tournament.Participants.ToList();
        foreach (var participant in participants)
        {
            var participantEntity = new ParticipantEntity(participant);
            tasks.Add(ParticipantClient.AddEntityAsync(participantEntity));
        }

        await Task.WhenAll(tasks);
    }

}
