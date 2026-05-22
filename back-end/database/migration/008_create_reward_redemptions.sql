CREATE TABLE reward_redemptions (
    id                uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_activity_id  uuid         NOT NULL,
    reward_status     varchar(30)  NOT NULL CHECK (
        reward_status IN ('pending', 'redeemed', 'cancelled')
    ),
    redeemed_by       varchar(100) NOT NULL,
    redeemed_at       varchar(19)  NULL,
    remark            text         NULL,
    created_at        varchar(19)  NOT NULL,

    CONSTRAINT fk_redemptions_user_activity
        FOREIGN KEY (user_activity_id) REFERENCES user_activities(id) ON DELETE RESTRICT
);
