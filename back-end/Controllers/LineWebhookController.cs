
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/line")]
public class LineWebhookController : ControllerBase
{
    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var body =
            await new StreamReader(Request.Body)
                .ReadToEndAsync();

        Console.WriteLine(body);

        using var document =
            JsonDocument.Parse(body);

        var root = document.RootElement;

        var events =
            root.GetProperty("events");

        foreach (var ev in events.EnumerateArray())
        {
            var eventType =
                ev.GetProperty("type").GetString();

            Console.WriteLine(
                $"Event Type: {eventType}"
            );

            if (eventType == "follow")
            {
                var userId =
                    ev.GetProperty("source")
                        .GetProperty("userId")
                        .GetString();

                Console.WriteLine(
                    $"Follow UserId: {userId}"
                );

                // TODO:
                // insert users table
            }

            if (eventType == "unfollow")
            {
                var userId =
                    ev.GetProperty("source")
                        .GetProperty("userId")
                        .GetString();

                Console.WriteLine(
                    $"Unfollow UserId: {userId}"
                );
            }
        }

        return Ok();
    }
}

