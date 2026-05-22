CREATE TABLE activity_campaigns (
    id                   uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    title                varchar(100) NOT NULL,
    description          text         NOT NULL,
    required_spot_count  int          NOT NULL CHECK (required_spot_count > 0),
    start_date           varchar(19)  NOT NULL,
    end_date             varchar(19)  NOT NULL,
    is_enabled           boolean      NOT NULL DEFAULT true,
    created_at           varchar(19)  NOT NULL,
    updated_at           varchar(19)  NOT NULL
);
