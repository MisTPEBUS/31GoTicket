
using back_end.DTOs;

namespace back_end.Repositories;

public interface IActivityRepository
{
    Task<ActivityCurrentResponse?>
        GetCurrentActivityAsync(
            string lineUserId
        );
}

