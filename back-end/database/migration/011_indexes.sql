-- users
CREATE INDEX idx_users_line_user_id
    ON users(line_user_id);

-- user_activities
CREATE INDEX idx_user_activities_user_id
    ON user_activities(user_id);

CREATE INDEX idx_user_activities_status
    ON user_activities(status);

-- user_activity_checkins
CREATE INDEX idx_checkins_activity
    ON user_activity_checkins(user_activity_id);

-- activity_spots
CREATE INDEX idx_spots_qrcode
    ON activity_spots(qrcode_token);
