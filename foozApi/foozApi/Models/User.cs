using Discord.Rest;
using TableWorm;
using TableWorm.Attributes;

namespace foozApi.Models;

[TableName("Users")]
public class User : TableModel
{
    public User()
    {

    }

    public User(RestSelfUser user)
    {
        Id = user.Id.ToString();
        Name = user.Username;
        PartitionKey = user.Locale;
    }

    public string Name { get; set; } = null!;
    public string Locale { get; set; } = null!;
    [TableJson]
    public IEnumerable<string> Roles { get; set; } = Enumerable.Empty<string>();
}
