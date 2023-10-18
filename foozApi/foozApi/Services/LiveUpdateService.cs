using foozApi.DTO;
using System.Net.WebSockets;
using System.Text;

namespace foozApi.Services;

public class LiveUpdateService
{
    private readonly Dictionary<string, List<WebSocket>> webSockets;
    private readonly List<Task> activeConnections;
    public LiveUpdateService()
    {
        webSockets = new Dictionary<string, List<WebSocket>>();
        activeConnections = new List<Task>();
    }

    public async Task SendTimerUpdate(string id, TimerUpdate timerUpdate, int amount = 0)
    {
        if (!webSockets.ContainsKey(id))
        {
            return;
        }
        var payload = $"timer:{timerUpdate}:{amount}";

        var bytes = Encoding.UTF8.GetBytes(payload);
        var buffer = new ArraySegment<byte>(bytes);
        var tasks = new List<Task>();
        foreach (WebSocket ws in webSockets[id])
        {
            tasks.Add(ws.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None));
        }

        await Task.WhenAll(tasks);
    }

    public async Task SendUpdate(string id)
    {
        if (!webSockets.ContainsKey(id))
        {
            return;
        }

        var bytes = Encoding.UTF8.GetBytes("update");
        var buffer = new ArraySegment<byte>(bytes);
        var tasks = new List<Task>();
        foreach (WebSocket ws in webSockets[id])
        {
            tasks.Add(ws.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None));
        }

        await Task.WhenAll(tasks);
    }

    public async Task ConnectClient(WebSocket ws, string id)
    {
        if (!webSockets.ContainsKey(id))
        {
            webSockets[id] = new List<WebSocket>();
        }

        webSockets[id].Add(ws);
        await Activate(ws);

        if (webSockets[id].Contains(ws))
        {
            webSockets[id].Remove(ws);
        }
        webSockets[id].RemoveAll(ws => ws == null);
    }

    private async Task Activate(WebSocket ws)
    {
        var buffer = new byte[1024 * 4];
        var receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);

        while (!receiveResult.CloseStatus.HasValue)
        {
            receiveResult = await ws.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);
        }
        
    }
}