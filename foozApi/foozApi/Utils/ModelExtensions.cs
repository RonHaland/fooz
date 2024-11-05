using foozApi.Models;

namespace foozApi.Utils;

public static class ModelExtensions
{

    public static int MatchCountWith(this Player player, Player target, IEnumerable<Match> matches)
    {
        var count = 0;
        var matchesWithBoth = matches.Where(m => m.Players.Contains(player) && m.Players.Contains(target));
        if (!matchesWithBoth.Any())
        {
            // no matches containing both players
            return 0;
        }

        count += matchesWithBoth.Count(c =>
            c.Team1Player1 == player && c.Team1Player2 == target ||
            c.Team1Player1 == target && c.Team1Player2 == player);

        count += matchesWithBoth.Count(c =>
            c.Team2Player1 == player && c.Team2Player2 == target ||
            c.Team2Player1 == target && c.Team2Player2 == player);

        return count;
    }
}
