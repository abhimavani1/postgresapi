CREATE DATABASE aeron-db;

CREATE TABLE users(
    id bigint PRIMARY KEY,
    user_name text(255),
    email text(50),
    password text(50),
),

CREATE TABLE shops(
   shop_id bigint PRIMARY KEY,
    shop_type text,
    shop_name text,
    proprietor text,
    contact_number text,
    shop_level text,
    shop_level text,
    star_rating text,
    shop_photos text,    
)
