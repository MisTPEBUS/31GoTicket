CREATE TABLE line_push_logs (
    id            uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       uuid         NOT NULL,
    message_type  varchar(50)  NOT NULL,
    message       text         NOT NULL,
    is_success    boolean      NOT NULL DEFAULT false,
    response      text         NULL,
    pushed_at     varchar(19)  NOT NULL,
    created_at    varchar(19)  NOT NULL,

    CONSTRAINT fk_push_logs_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
