CREATE TABLE admin_users (
    id             uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
    account        varchar(100) NOT NULL UNIQUE,
    password_hash  varchar(255) NOT NULL,
    name           varchar(100) NOT NULL,
    role           varchar(30)  NOT NULL CHECK (role IN ('super_admin', 'admin', 'staff')),
    is_enabled     boolean      NOT NULL DEFAULT true,
    created_at     varchar(19)  NOT NULL
);
