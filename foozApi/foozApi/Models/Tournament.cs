using AzureTableContext;
using AzureTableContext.Attributes;

namespace foozApi.Models;

[TableName("Tournaments")]
public class Tournament : TableModel
{
    public Tournament() { }

    public string Name { get; set; } = null!;
    [TableIgnore]
    public bool? IsCompleted => Rounds?.All(m => m.IsCompleted);
    [TableIgnore]
    public IEnumerable<Participant> Participants { get; set; } = Enumerable.Empty<Participant>();
    public List<Round>? Rounds { get; set; } = [];
}
