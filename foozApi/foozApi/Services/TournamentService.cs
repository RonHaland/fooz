using foozApi.DTO;
using foozApi.Models;
using foozApi.Storage;
using foozApi.Utils;

namespace foozApi.Services;

public class TournamentService
{
    private readonly TableStorage _tableStorage;

    public TournamentService(TableStorage tableStorage)
	{
        _tableStorage = tableStorage;
    }

    public async Task<Tournament> CreateTournament(PostTournament postTournament)
    {
        var tournament = new Tournament
        {
            Name = postTournament.Name,
        };

        tournament.Participants = CreateParticipants(postTournament.Participants, tournament);
        tournament.Rounds = CreateRounds(postTournament.RoundCount, tournament.Participants, tournament).OrderBy(r => r.RoundNumber);

        //await _tableStorage.AddTournament(tournament);

        return tournament;
    }

    public IEnumerable<Participant> CreateParticipants(IEnumerable<ParticipantDto> participants, Tournament tournament)
    {
        return participants.Select(p => new Participant
        {
            Name = p.Name,
            Weigth = p.Weight,
            Tournament = tournament,
        });
    }

    public IEnumerable<Round> CreateRounds(int roundCount, IEnumerable<Participant> participants, Tournament tournament)
    {
        var participantCount = participants.Count();
        if (participantCount % 2 == 0)
        {
            return Enumerable.Range(0, roundCount - 1).Select(i => CreateRound(i, participants, tournament));
        }

        var split = participantCount / roundCount;
        var finalSplit = participantCount - (split * (roundCount - 1));
        var allParticipants = participants.ToList();
        var rounds = new List<Round>();

        foreach (var ind in Enumerable.Range(0, roundCount))
        {
            var currentSplit = (ind == roundCount - 1 ? finalSplit : split);
            if (currentSplit % 2 == 0) 
            {
                currentSplit = currentSplit - 1 + ((ind % 2) * 2);
            }

            var take = participantCount - currentSplit;
            var roundParticipants = allParticipants.Shift(split * ind).Take(take);
            rounds.Add(CreateRound(ind, roundParticipants, tournament));
        }

        return rounds;
    }

    public Round CreateRound(int roundNumber, IEnumerable<Participant> participants, Tournament tournament)
    {
        var participantList = participants
            .OrderBy(p => Random.Shared.Next(1000)).ToList();

        var round = new Round
        {
            RoundNumber = roundNumber,
            Tournament = tournament,
        };

        var teams = participants
            .Select((p, i) => i % 2 == 0 
                ? new Team 
                { 
                    Round = round,
                    Player1 = participantList[i], 
                    Player2 = participantList[i+1],
                } 
                : null)
            .Where(p => p != null);
        round.Teams = teams!;
        

        round.Matches = CreateMatches(round, teams!);

        return round;
    }

    public IEnumerable<Match> CreateMatches(Round round, IEnumerable<Team> teams)
    {
        var matchTeams = teams.ToList();
        var teamCount = matchTeams.Count;
        var subRoundCount = 3;
        var matches = new List<Match>();

        if (teamCount % 2 == 0)
        {
            foreach (var ind in Enumerable.Range(0, subRoundCount))
            {
                var newMatches = teams.Select((sr, i) => i % 2 == 0
                ? new Match
                {
                    Team1 = matchTeams[i],
                    Team2 = matchTeams[i + 1],
                    Round = round,
                }
                : null)
                .Where(m => m != null);

                matches.AddRange(newMatches!);
            }
        } 
        else
        {
            var split = teamCount / subRoundCount;
            var finalSplit = teamCount - (split * (subRoundCount - 1));


            foreach (var ind in Enumerable.Range(0, subRoundCount))
            {
                var currentSplit = (ind == subRoundCount - 1 ? finalSplit : split);
                var take = subRoundCount - currentSplit;
                var subRoundTeams = matchTeams.Shift(split * ind).Take(take).ToList();
                var newMatches = subRoundTeams.Select((sr, i) => i % 2 == 0
                    ? new Match
                    {
                        Team1 = subRoundTeams[i],
                        Team2 = subRoundTeams[i + 1],
                        Round = round,
                    }
                    : null)
                    .Where(m => m != null);

                matches.AddRange(newMatches!);
            }
        }

        return matches;
    }
}
