DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age VARCHAR(100),
    city VARCHAR(100),
    homepage VARCHAR(200),
    user_id INTEGER REFERENCES users(id)
);
INSERT INTO user_profiles (age, city, homepage, user_id) VALUES ('33', 'Berlin', 'google.com', 2);
INSERT INTO user_profiles (age, city, homepage, user_id) VALUES ('23', 'Berlin', 'postgresql.org' ,1);
INSERT INTO user_profiles (age, city, homepage, user_id) VALUES ('46', 'Wellington', 'twitter.com', 3);
INSERT INTO user_profiles (age, city, user_id) VALUES ('34', 'NewYork', 4);
INSERT INTO user_profiles (age, city, user_id) VALUES ('19', 'Wellington',5);
