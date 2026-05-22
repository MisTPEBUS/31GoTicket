CREATE TABLE user_activities (
    id                 uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            uuid         NOT NULL,
    campaign_id        uuid         NOT NULL,
    order_no           varchar(100) NOT NULL UNIQUE,
    participant_name   varchar(100) NOT NULL,
    participant_phone  varchar(30)  NOT NULL,
    participant_email  varchar(255) NOT NULL,
    agree_privacy      boolean      NOT NULL DEFAULT false,
    started_at         varchar(19)  NOT NULL,
    expired_at         varchar(19)  NOT NULL,
    completed_at       varchar(19)  NULL,
    reward_qrcode      varchar(255) NULL,
    status             varchar(30)  NOT NULL CHECK (
        status IN (
            'pending',
            'expired',
            'completed_unclaimed',
            'completed_claimed',
            'reward_pending'
        )
    ),
    created_at         varchar(19)  NOT NULL,
    updated_at         varchar(19)  NOT NULL,

    CONSTRAINT fk_user_activities_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,

    CONSTRAINT fk_user_activities_campaign
        FOREIGN KEY (campaign_id) REFERENCES activity_campaigns(id) ON DELETE RESTRICT
);
