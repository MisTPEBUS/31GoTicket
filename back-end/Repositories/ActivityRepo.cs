
using Dapper;
using Npgsql;
using back_end.DTOs;

namespace back_end.Repositories;

public class ActivityRepository
    : IActivityRepository
{
    private readonly IConfiguration
        _configuration;

    public ActivityRepository(
        IConfiguration configuration
    )
    {
        _configuration =
            configuration;
    }

    private NpgsqlConnection
        CreateConnection()
    {
        var connectionString =
            _configuration
                .GetConnectionString(
                    "DefaultConnection"
                );

        return new NpgsqlConnection(
            connectionString
        );
    }

    public async Task<
        ActivityCurrentResponse?
    > GetCurrentActivityAsync(
        string lineUserId
    )
    {
        const string sql = """
            SELECT
                ua.id AS UserActivityId,
                ua.order_no AS OrderNo,
                ua.started_at AS StartedAt,
                ua.expired_at AS ExpiredAt,
                ua.completed_at AS CompletedAt,
                ua.reward_qrcode AS RewardQrcode,
                ua.status AS Status
            FROM user_activities ua
            INNER JOIN users u
                ON u.id = ua.user_id
            WHERE u.line_user_id =
                @LineUserId
            ORDER BY ua.created_at DESC
            LIMIT 1
            """;

        using var conn =
            CreateConnection();

        return await conn
            .QueryFirstOrDefaultAsync<
                ActivityCurrentResponse
            >(
                sql,
                new
                {
                    LineUserId =
                        lineUserId
                }
            );
    }
}