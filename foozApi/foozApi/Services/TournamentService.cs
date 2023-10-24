using foozApi.DTO;
using foozApi.Models;
using foozApi.Storage;
using foozApi.Utils;

namespace foozApi.Services;

public class TournamentService
{
    private readonly TableStorage _tableStorage;
    private readonly LiveUpdateService _liveUpdater;

    public TournamentService(TableStorage tableStorage, LiveUpdateService liveUpdater)
	{
        _tableStorage = tableStorage;
        _liveUpdater = liveUpdater;
    }

    public async Task<Tournament> CreateTournament(PostTournament postTournament)
    {
        var tournament = new Tournament
        {
            Name = postTournament.Name,
        };

        tournament.Participants = CreateParticipants(postTournament.Participants, tournament).ToList();
        //var rounds = CreateRounds(postTournament.RoundCount, tournament.Participants, tournament).ToList();
        tournament.Rounds = CreateRounds(postTournament.RoundCount, tournament.Participants, tournament).OrderBy(r => r.RoundNumber).ToList();

        foreach (var player in tournament.Participants)
        {
            var teams = tournament.Rounds
                .SelectMany(r => r.Teams)
                .Where(t => t.Player1.Id.Equals(player.Id)
                        || t.Player2.Id.Equals(player.Id))
                .ToList();
            player.Teams = teams;
        }

        await _tableStorage.AddTournament(tournament);

        return tournament;
    }

    public async Task<CurrentMatchResponse?> GetCurrentMatch(string tournamentId, string? matchId = null)
    {
        var matches = await _tableStorage.GetMatchesAsync(tournamentId);
        if (matches == null)
        {
            return null;
        }

        var isCompleted = false;
        var matchList = matches.OrderBy(m => m.RoundNumber).ThenBy(m => m.MatchNumber).ToList();
        Match? current;
        if (matchId == null)
        {
            current = matches.FirstOrDefault(m => !m.IsCompleted);
        }
        else
        {
            current = matches.FirstOrDefault(m => m.Id.ToString() == matchId);
        }

        if (current == null)
        {
            if (!matches.All(m => m.IsCompleted))
            {
                return null;
            }
            isCompleted = true;
        }
        var currentInd = matchList.IndexOf(current);
        var response = new CurrentMatchResponse
        {
            CurrentMatch = current,
            PreviousMatch = currentInd switch
            {
                < 0 => matchList[matchList.Count - 1],
                < 1 => null,
                _ => matchList[currentInd - 1]
            }
        };
        if (currentInd < (matchList.Count - 1) && currentInd >= 0)
        {
            response.NextMatch = matchList[currentInd + 1];
        }
        response.IsComplete = isCompleted;

        return response;
    }

    public async Task<TournamentsResponse[]?> GetTournaments()
    {
        return _tableStorage.GetTournamentsList();
    }

    public async Task UpdateMatchScore(PutMatch putMatch, string tournamentId, string matchId)
    {
        if ((putMatch.WinningTeam < 1 ||  putMatch.WinningTeam > 2) && putMatch.WinType != WinType.Draw) 
        { 
            return; 
        }

        var team1Score = 0;
        var team2Score = 0;
        switch (putMatch.WinType) 
        {
            case WinType.Draw:
                team1Score = 1;
                team2Score = 1;
                break;
            default:
                team1Score = (putMatch.WinningTeam == 1 ? (int)putMatch.WinType : 0);
                team2Score = (putMatch.WinningTeam == 2 ? (int)putMatch.WinType : 0);
                break;
        }
        await _tableStorage.UpdateMatchScore(tournamentId, matchId, team1Score, team2Score);
        await _liveUpdater.SendUpdate(tournamentId);
    }

    private IEnumerable<Participant> CreateParticipants(IEnumerable<ParticipantDto> participants, Tournament tournament)
    {
        return participants.Select(p => new Participant
        {
            Name = p.Name,
            Weigth = p.Weight,
            Tournament = tournament,
            Id = Guid.NewGuid(),
        });
    }

    private IEnumerable<Round> CreateRounds(int roundCount, IEnumerable<Participant> participants, Tournament tournament)
    {
        var participantCount = participants.Count();
        if (participantCount % 2 == 0)
        {
            return Enumerable.Range(0, roundCount).Select(i => CreateRound(i, participants, tournament));
        }

        // split is how many players we will have to skip this round in order for everyone to have the same number of games
        var split = participantCount / roundCount;
        var finalSplit = participantCount - (split * (roundCount - 1));
        var allParticipants = participants.ToList();
        var rounds = new List<Round>();

        foreach (var ind in Enumerable.Range(0, roundCount))
        {
            var currentSplit = (ind == roundCount - 1 ? finalSplit : split);
            // At this point the split has to be an odd number since the number of participants in the round is odd: odd - odd = even
            if (currentSplit % 2 == 0) 
            {
                currentSplit = currentSplit - 1 + ((ind % 2) * 2);
            }

            var take = participantCount - currentSplit;
            // Probably need to rewrite the shiftCount to account for the code block above.
            var roundParticipants = allParticipants.Shift(split * ind).Take(take);
            rounds.Add(CreateRound(ind, roundParticipants, tournament));
        }

        return rounds;
    }

    private Round CreateRound(int roundNumber, IEnumerable<Participant> participants, Tournament tournament)
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
            .Where(p => p != null)
            .Select(p => p!)
            .ToList();
        round.Teams = teams;
        

        round.Matches = CreateMatches(round, teams);

        return round;
    }

    private IEnumerable<Match> CreateMatches(Round round, IEnumerable<Team> teams)
    {
        var matchTeams = teams.ToList();
        var teamCount = matchTeams.Count;
        var subRoundCount = 3;
        var matches = new List<Match>();

        if (teamCount % 2 == 0)
        {
            var matchNumber = 0;
            foreach (var ind in Enumerable.Range(0, subRoundCount))
            {
                var newMatches = teams.Shift(3 * ind).Select((sr, i) => i % 2 == 0
                ? new Match
                {
                    Team1 = matchTeams[i],
                    Team2 = matchTeams[i + 1],
                    Round = round,
                    MatchNumber = matchNumber++,
                }
                : null)
                .Where(m => m != null)
                .ToList();

                matches.AddRange(newMatches!);
            }
        } 
        else
        {
            var split = teamCount / subRoundCount;
            var finalSplit = teamCount - (split * (subRoundCount - 1));
            var matchNumber = 0;

            foreach (var ind in Enumerable.Range(0, subRoundCount))
            {
                var currentSplit = (ind == subRoundCount - 1 ? finalSplit : split);
                var take = teamCount - currentSplit;
                var subRoundTeams = matchTeams.Shift(split * ind).Take(take).ToList();
                var newMatches = subRoundTeams.Select((sr, i) => i % 2 == 0
                    ? new Match
                    {
                        Team1 = subRoundTeams[i],
                        Team2 = subRoundTeams[i + 1],
                        Round = round,
                        MatchNumber = matchNumber++,
                    }
                    : null)
                    .Where(m => m != null)
                    .ToList();

                matches.AddRange(newMatches!);
            }
        }

        return matches;
    }
}
