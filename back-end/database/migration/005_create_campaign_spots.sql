CREATE TABLE campaign_spots (
    id           uuid        PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id  uuid        NOT NULL,
    spot_id      uuid        NOT NULL,
    created_at   varchar(19) NOT NULL,

    CONSTRAINT fk_campaign_spots_campaign
        FOREIGN KEY (campaign_id) REFERENCES activity_campaigns(id) ON DELETE CASCADE,

    CONSTRAINT fk_campaign_spots_spot
        FOREIGN KEY (spot_id) REFERENCES activity_spots(id) ON DELETE CASCADE,

    CONSTRAINT uq_campaign_spots UNIQUE (campaign_id, spot_id)
);
