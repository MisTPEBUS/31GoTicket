CREATE TABLE activity_spots (
    id            uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name          varchar(100) NOT NULL,
    description   text         NOT NULL,
    address       varchar(255) NOT NULL,
    qrcode_token  varchar(255) NOT NULL UNIQUE,
    image_url     varchar(255) NULL,
    sort_order    int          NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_enabled    boolean      NOT NULL DEFAULT true,
    created_at    varchar(19)  NOT NULL,
    updated_at    varchar(19)  NOT NULL
);
