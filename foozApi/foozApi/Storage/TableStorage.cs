using Azure.Data.Tables;
using foozApi.Models;
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
            tasks.Add(MatchClient.AddEntityAsync(matchEntity));
        }

        var teams = tournament.Rounds.SelectMany(r => r.Teams).ToList();
        foreach (var team in teams)
        {
            var teamEntity = new TeamEntity(team);
            tasks.Add(TeamClient.AddEntityAsync(teamEntity));
        }

        var participants = tournament.Participants.ToList();
        foreach (var participant in participants)
        {
            var participantEntity = new ParticipantEntity(participant);
            tasks.Add(ParticipantClient.AddEntityAsync(participantEntity));
        }

        await Task.WhenAll(tasks);
    }


    public async Task<Models.Tournament?> GetTournament(string tournamentId)
    {
        var tournamentEntity = TournamentClient.Query<TournamentEntity>($"RowKey eq '{tournamentId}'").FirstOrDefault();
        if  (tournamentEntity == null)
        {
            return null;
            //Not found
        }

        var tournamentRoundTasks = Enumerable
                            .Range(0, tournamentEntity.RoundCount)
                            .Select(ind => RoundClient.GetEntityAsync<RoundEntity>(tournamentId, ind.ToString()));
        var tournamentRoundEntities = (await Task.WhenAll(tournamentRoundTasks)).Select(a => a.Value);

        var matchAndTeamQuery = string.Join(" or ", tournamentRoundEntities.Select(r => $"PartitionKey eq '{tournamentId}_{r.RowKey}'"));

        var matchEntities = MatchClient.Query<MatchEntity>(matchAndTeamQuery);
        var teamEntities = TeamClient.Query<TeamEntity>(matchAndTeamQuery);
        var participantEntities = ParticipantClient.Query<ParticipantEntity>($"PartitionKey eq '{tournamentId}'");

        var tournament = new Tournament(tournamentEntity);
        var participants = participantEntities.Select(p => new Participant(p));
        var rounds = tournamentRoundEntities.Select(r => new Round(r, tournament));
        var roundDictionary = rounds.ToDictionary(r => r.Id);
        var playerDictionary = participants.ToDictionary(p => p.Id.ToString());

        var teams = teamEntities.Select(t => new Team(t, roundDictionary, playerDictionary));

        var teamDictionary = teams.ToDictionary(t => t.Id.ToString());
        var matches = matchEntities.Select(m => new Match(m, roundDictionary, teamDictionary));

        foreach (var round in rounds)
        {
            var roundMatches = matches.Where(m => m.RoundId == round.Id);
            var roundTeams = teams.Where(t => t.RoundId == round.Id);
            round.Matches = roundMatches.OrderBy(m => m.MatchNumber);
            round.Teams = roundTeams;
        }

        tournament.Rounds = rounds.OrderBy(r => r.RoundNumber);
        tournament.Participants = participants;
        foreach (var player in participants)
        {
            var playerTeams = teams
                .Where(t => t.Player1.Id.Equals(player.Id)
                        || t.Player2.Id.Equals(player.Id));
            player.Teams = playerTeams;
        }

        return tournament;
    }
}
