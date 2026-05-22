CREATE TABLE users (
    id            uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    line_user_id  varchar(100) NOT NULL UNIQUE,
    name          varchar(100) NOT NULL,
    phone         varchar(30)  NULL,
    email         varchar(255) NULL,
    created_at    varchar(19)  NOT NULL,
    updated_at    varchar(19)  NOT NULL
);
