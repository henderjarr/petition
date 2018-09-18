DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age VARCHAR(100),
    city VARCHAR(100),
    homepage VARCHAR(200),
    user_id INTEGER REFERENCES users(id)
);