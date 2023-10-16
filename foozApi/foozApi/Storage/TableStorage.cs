﻿using Azure.Data.Tables;
using foozApi.Models;
using foozApi.Storage.Entities;
using System.Diagnostics;
using System.Linq;

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

        var matches = tournament.Rounds.SelectMany(r => r.Matches).ToArray();
        foreach (var match in matches)
        {
            var matchEntity = new MatchEntity(match);
            tasks.Add(MatchClient.AddEntityAsync(matchEntity));
        }

        var teams = tournament.Rounds.SelectMany(r => r.Teams);
        foreach (var team in teams)
        {
            var teamEntity = new TeamEntity(team);
            tasks.Add(TeamClient.AddEntityAsync(teamEntity));
        }

        var participants = tournament.Participants;
        foreach (var participant in participants)
        {
            var participantEntity = new ParticipantEntity(participant);
            tasks.Add(ParticipantClient.AddEntityAsync(participantEntity));
        }

        await Task.WhenAll(tasks);
    }

    public async Task<Models.Tournament?> GetTournament(string tournamentId)
    {
        var sw = new Stopwatch();
        sw.Start();
        var tournamentEntity = TournamentClient.Query<TournamentEntity>($"RowKey eq '{tournamentId}'").FirstOrDefault();
        if (tournamentEntity == null)
        {
            return null;
            //Not found
        }
        Console.WriteLine("1: {0}", sw.ElapsedMilliseconds);

        var tournamentRoundEntities = RoundClient.Query<RoundEntity>($"PartitionKey eq '{tournamentId}'").ToList();
        Console.WriteLine("2: {0}", sw.ElapsedMilliseconds);

        var matchAndTeamQuery = string.Join(" or ", tournamentRoundEntities.Select(r => $"PartitionKey eq '{tournamentId}_{r.RowKey}'"));

        var matchEntities = MatchClient.Query<MatchEntity>(matchAndTeamQuery).ToList();
        var teamEntities = TeamClient.Query<TeamEntity>(matchAndTeamQuery).ToList();
        var participantEntities = ParticipantClient.Query<ParticipantEntity>($"PartitionKey eq '{tournamentId}'");
        Console.WriteLine("3: {0}", sw.ElapsedMilliseconds);

        var tournament = new Tournament(tournamentEntity);
        var participants = participantEntities.Select(p => new Participant(p)).ToList();
        var rounds = tournamentRoundEntities.Select(r => new Round(r, tournament)).ToList();
        var roundDictionary = rounds.ToDictionary(r => r.Id);
        var playerDictionary = participants.ToDictionary(p => p.Id.ToString());
        Console.WriteLine("4: {0}", sw.ElapsedMilliseconds);

        var teams = teamEntities.Select(t => new Team(t, roundDictionary, playerDictionary)).ToList();
        Console.WriteLine("5: {0}", sw.ElapsedMilliseconds);

        var teamDictionary = teams.ToDictionary(t => t.Id.ToString());
        Console.WriteLine("6: {0}", sw.ElapsedMilliseconds);
        var matches = matchEntities.Select(m => new Match(m, roundDictionary, teamDictionary)).ToList();

        Console.WriteLine("7: {0}", sw.ElapsedMilliseconds);
        foreach (var round in rounds)
        {
            var roundMatches = matches.Where(m => m.RoundId == round.Id);
            var roundTeams = teams.Where(t => t.RoundId == round.Id);
            round.Matches = roundMatches.OrderBy(m => m.MatchNumber);
            round.Teams = roundTeams;
        }
        foreach (var team in teams)
        {
            team.HomeMatches = matches.Where(m => m.Team1.Id == team.Id);
            team.AwayMatches = matches.Where(m => m.Team2.Id == team.Id);
        }

        tournament.Rounds = rounds.OrderBy(r => r.RoundNumber).ToList();
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

    public async Task<IEnumerable<Match>?> GetMatches(string tournamentId)
    {
        var tournament = await GetTournament(tournamentId);
        return tournament?.Rounds.SelectMany(r => r.Matches).OrderBy(m => m.Round.RoundNumber).ThenBy(m => m.MatchNumber).ToList();
    }

    public async Task<IEnumerable<Match>?> GetMatchesAsync(string tournamentId)
    {
        var matchQuery = $"PartitionKey gt '{tournamentId}' and PartitionKey lt '{tournamentId}a'";
        var matchEntities = MatchClient.Query<MatchEntity>(matchQuery).ToList();

        var rounds = matchEntities.Select(m => m.RoundNumber)
            .Distinct()
            .Select(rn => new Round 
            { 
                Tournament = new Tournament 
                { Id = Guid.Parse(tournamentId) },
                RoundNumber = rn,
            }).ToDictionary(r => r.Id);

        var playerEntities = ParticipantClient.Query<ParticipantEntity>($"PartitionKey eq '{tournamentId}'");
        var players = playerEntities.Select(p => new Participant(p)).ToDictionary(p => p.Id.ToString());

        var teamQuery = string.Join(" or ", 
            matchEntities.Select(m => m.PartitionKey)
                        .Distinct()
                        .Select(pk => $"(PartitionKey ge '{pk}' and PartitionKey lt '{pk}a')"));
        var teamEntities = TeamClient.Query<TeamEntity>(teamQuery).ToList();
        var teams = teamEntities.Select(t => new Team(t, rounds, players)).ToDictionary(t => t.Id.ToString());

        var matches = matchEntities.Select(m => new Match(m, rounds, teams)).OrderBy(m => m.RoundNumber).ThenBy(m => m.MatchNumber);


        return matches.ToList();
    }
}
