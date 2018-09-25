
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(150) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO users (first_name, last_name, email, hashed_password) VALUES ('Frank', 'Sinatra', 'frank@gmail.com',  '$2a$10$S6z1jhitkXMCLJfbzOnUu.hnn3voX/y55gnWof7SEme2YjPlth8nm');
INSERT INTO users (first_name, last_name, email, hashed_password) VALUES ('Greta', 'Jones', 'greta@gmail.com', '$2a$10$hQr206Xn2lk0XLTuRCtCfusMMjPd1USlFmL9x.j1w7upWDiR00L8.');
INSERT INTO users (first_name, last_name, email, hashed_password) VALUES ('Joe', 'Jones', 'joe@gmail.com', '$2a$10$SDPWnrFyX.DbjeNwjmgTWea0.LMzTBAvoBPtYDtmf4k4ddJXUNw5y');
INSERT INTO users (first_name, last_name, email, hashed_password) VALUES ('Tom', 'Baker', 'tom@gmail.com', '$2a$10$vzrJeLNg./v2SlrhqNn8SOjrmOmT1D7g4ONKabJWRz9dRVclZtdT.');
INSERT INTO users (first_name, last_name, email, hashed_password) VALUES ('Sally', 'Art', 'sally@gmail.com', '$2a$10$U8vSUrAenpuit8fk95ySH.X1MpcKvCfY498Wt60zgsSoUmUZ9h6Me');
