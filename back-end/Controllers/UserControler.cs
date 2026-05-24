
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers;

[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpGet("{lineUserId}")]
    public IActionResult GetUser(
        string lineUserId
    )
    {
        return Ok(
            new
            {
                userId = lineUserId,
                carNo = "ABC-1234"
            }
        );
    }
}

