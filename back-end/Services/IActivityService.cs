using back_end.DTOs;

namespace back_end.Services;

public interface IActivityService
{
    Task<ActivityCurrentResponse>
        GetCurrentActivityAsync(
            string lineUserId
        );
}