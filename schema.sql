create table user (
    id int primary key,
    username varchar(50) unique,
    emial varchar(50) unique not null,
    password varchar(50) not null
);