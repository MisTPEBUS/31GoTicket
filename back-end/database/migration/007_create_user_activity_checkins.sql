CREATE TABLE user_activity_checkins (
    id                uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_activity_id  uuid        NOT NULL,
    spot_id           uuid        NOT NULL,
    checked_in_at     varchar(19) NOT NULL,
    created_at        varchar(19) NOT NULL,

    CONSTRAINT fk_checkins_user_activity
        FOREIGN KEY (user_activity_id) REFERENCES user_activities(id) ON DELETE CASCADE,

    CONSTRAINT fk_checkins_spot
        FOREIGN KEY (spot_id) REFERENCES activity_spots(id) ON DELETE RESTRICT,

    CONSTRAINT uq_checkins_activity_spot UNIQUE (user_activity_id, spot_id)
);
