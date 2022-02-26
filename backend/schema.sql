CREATE DATABASE IF NOT EXISTS photoshare;
USE photoshare;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Friends_With CASCADE;
DROP TABLE IF EXISTS Album CASCADE;
DROP TABLE IF EXISTS Photo CASCADE;
DROP TABLE IF EXISTS Comment CASCADE;
DROP TABLE IF EXISTS Tag CASCADE;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE 
Users ( 
	 user_id INTEGER, 
	 first_name VARCHAR(50),
	 last_name VARCHAR(50), 
	 email VARCHAR(50) NOT NULL,
	 gender ENUM('M', 'F', 'O') ,
	 hometown VARCHAR(50),
	 date_of_birth DATE,
	 password VARCHAR(255) NOT NULL, 
	 PRIMARY KEY (user_id)
);

/* friends_with - the friends relation */ 

CREATE TABLE 
Friends_With ( 
friend_one_id INTEGER, 
friend_two_id INTEGER,
PRIMARY KEY (friend_one_id, friend_two_id),	
	FOREIGN KEY (friend_one_id) REFERENCES Users(user_id) ON DELETE CASCADE, 
	FOREIGN KEY (friend_two_id) REFERENCES Users(user_id) ON DELETE CASCADE,
CHECK (friend_one_id <> friend_two_id));


/* Album - participation and foreign key constraint */ 

CREATE TABLE 
Album (
	album_id INTEGER,
name VARCHAR(50) NOT NULL, 
date_of_creation DATE,
	user_id INTEGER NOT NULL,
PRIMARY KEY (album_id), 
FOREIGN KEY (user_id) REFERENCES Users(user_id) 
ON DELETE CASCADE);


/* Photo - participation and foreign key constraints */ 

CREATE TABLE 
Photo ( 
photo_id INTEGER, 
caption VARCHAR(255),
data VARBINARY(255) NOT NULL,
-- likes_user_ids SET,
-- tags SET, 
album_id INTEGER NOT NULL,
PRIMARY KEY (photo_id),
FOREIGN KEY (album_id) REFERENCES Album(album_id)
ON DELETE CASCADE);

/* Comment - comment weak entity and it’s identifying relationship - participation and foreign key constraints */

CREATE TABLE 
Comment (
	user_id INTEGER, 
	timestamp TIMESTAMP, 
	text VARCHAR(255) NOT NULL, 
	photo_id INTEGER, 
	PRIMARY KEY (user_id, photo_id, timestamp), 
	FOREIGN KEY (photo_id) REFERENCES Photo(photo_id)
	ON DELETE CASCADE,
FOREIGN KEY (user_id) REFERENCES Users(user_id)
ON DELETE CASCADE
);

/* Tag entity */ 

CREATE TABLE 
Tag ( 
	tag_id INTEGER, 
	name VARCHAR(50),
	quantity INTEGER DEFAULT 1,
-- 	photo_ids SET, 
	UNIQUE (name),
	PRIMARY KEY (tag_id));
