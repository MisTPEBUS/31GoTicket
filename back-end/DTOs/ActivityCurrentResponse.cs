namespace back_end.DTOs;

public class ActivityCurrentResponse
{
    public string Status { get; set; }
        = "NONE";

    public string? UserActivityId { get; set; }

    public string? OrderNo { get; set; }

    public string? StartedAt { get; set; }

    public string? ExpiredAt { get; set; }

    public string? CompletedAt { get; set; }

    public string? RewardQrcode { get; set; }
}
