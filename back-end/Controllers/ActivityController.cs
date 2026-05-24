
using Microsoft.AspNetCore.Mvc;
using back_end.Services;

namespace back_end.Controllers;

[ApiController]
[Route("api/activity")]
public class ActivityController
    : ControllerBase
{
    private readonly
        IActivityService
        _activityService;

    public ActivityController(
        IActivityService
            activityService
    )
    {
        _activityService =
            activityService;
    }

    [HttpGet("current/{lineUserId}")]
    public async Task<IActionResult>
        GetCurrentActivity(
            string lineUserId
        )
    {
        var result =
            await _activityService
                .GetCurrentActivityAsync(
                    lineUserId
                );

        return Ok(result);
    }
}