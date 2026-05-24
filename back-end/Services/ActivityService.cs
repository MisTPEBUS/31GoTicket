
using back_end.DTOs;
using back_end.Repositories;

namespace back_end.Services;



public class ActivityService
    : IActivityService
{
    private readonly
        IActivityRepository
        _activityRepository;

    public ActivityService(
        IActivityRepository
            activityRepository
    )
    {
        _activityRepository =
            activityRepository;
    }

    public async Task<
        ActivityCurrentResponse
    > GetCurrentActivityAsync(
        string lineUserId
    )
    {
        var activity =
            await _activityRepository
                .GetCurrentActivityAsync(
                    lineUserId
                );

        if (activity == null)
        {
            return new
                ActivityCurrentResponse
            {
                Status = "NONE"
            };
        }

        activity.Status = activity.Status switch
        {
            "pending"
                => "ACTIVE",

            "expired"
                => "EXPIRED",

            "completed_unclaimed"
                => "COMPLETED",

            "completed_claimed"
                => "REWARDED",

            "reward_pending"
                => "REWARD_PENDING",

            _
                => "NONE"
        };


        return activity;
    }
}