
namespace back_end.Models;

public class User
{
    public string Id { get; set; } = "";

    public string LineUserId { get; set; } = "";

    public string? Name { get; set; }

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string CreatedAt { get; set; } = "";

    public string UpdatedAt { get; set; } = "";
}

