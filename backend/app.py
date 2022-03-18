######################################
# author ben lawson <balawson@bu.edu>
# Edited by: Craig Einstein <einstein@bu.edu>
######################################
# Some code adapted from
# CodeHandBook at http://codehandbook.org/python-web-application-development-using-flask-and-mysql/
# and MaxCountryMan at https://github.com/maxcountryman/flask-login/
# and Flask Offical Tutorial at  http://flask.pocoo.org/docs/0.10/patterns/fileuploads/
# see links for further understanding
###################################################

import base64
import json
from turtle import home
from typing import Type
from flask import Flask, request
from flaskext.mysql import MySQL
import flask_login
from flask_cors import CORS
from dateutil import parser

# for albums and comments 
import datetime
import time

mysql = MySQL()

app = Flask(__name__)
CORS(app, support_credentials=True)

app.secret_key = 'super secret string'  # Change this!

#These will need to be changed according to your creditionals
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'cs460'
app.config['MYSQL_DATABASE_DB'] = 'photoshare'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
# app.before_request_funcs.setdefault(None, [decode_cookie])

mysql.init_app(app)

#begin code used for login
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

conn = mysql.connect()
cursor = conn.cursor()
cursor.execute("SELECT email from Users")
users = cursor.fetchall()

def getUserList():
	cursor = conn.cursor()
	cursor.execute("SELECT email from Users")
	return cursor.fetchall()

def getUserFromEmail(email):
	print(email)
	cursor = conn.cursor()
	cursor.execute("SELECT user_id FROM Users WHERE email = '{0}'".format(email))
	return cursor.fetchone()[0]

class User(flask_login.UserMixin):
	pass

@login_manager.user_loader
def user_loader(email):
	users = getUserList()
	if not(email) or email not in str(users):
		return
	user = User()
	user.id = email
	return user

# WTF IS THIS lol
@login_manager.request_loader
def request_loader(request):
	users = getUserList()
	email = request.form.get('email')
	if not(email) or email not in str(users):
		return
	user = User()
	user.id = email
	cursor = mysql.connect().cursor()
	cursor.execute("SELECT password FROM Users WHERE email = '{0}'".format(email))
	data = cursor.fetchall()
	pwd = str(data[0][0] )
	user.is_authenticated = request.form['password'] == pwd
	return user

'''
A new page looks like this:
@app.route('new_page_name')
def new_page_function():
	return new_page_html
'''

@app.route('/login', methods=['POST'])
def login():
	""" 
	login(): 

	payload: 
		{
			"email": string 
			"password": string 
		}
	
	response: 
		{
			err: None 
			profile: {
				"user_id": string 
				"first_name": string 
				"last_name": string 
				"email": string 
				"gender": string 
				"date_of_birth": timestamp 
			}
		}
	errs: 
	
	invalid creds err: { err: invalid credentials, profile: None }

	"""
	payload = request.get_json(force=True)
	try:
		email = payload['email']
		given_password = payload['password']
	except: 
		return {"err": "malformed request. missing fields", "profile": None}
	cursor = conn.cursor()
	# check if email is registered
	if cursor.execute("SELECT password, first_name, last_name, email, gender, hometown, date_of_birth, user_id FROM Users WHERE email = '{0}'".format(email)):
		data = cursor.fetchall()
		pwd = str(data[0][0])
		if given_password == pwd:
			user = User()
			user.id = email
			flask_login.login_user(user) # okay login in user
			# return a dictionary with info about the user 
			return {
				"err": None, 
				"profile": {
					"user_id": str(data[0][7]),
					"first_name": str(data[0][1]), 
					"last_name": str(data[0][2]), 
					"email": str(data[0][3]),
					"gender": str(data[0][4]),
					"hometown": str(data[0][5]),
					"date_of_birth": data[0][6]
				}
			}
	# information did not match
	return {"err": "invalid credentials", "profile": None}

@app.route('/logout')
def logout():
	flask_login.logout_user()
	return {"err": None, "data": "User successfully logged out"}

@login_manager.unauthorized_handler
def unauthorized_handler():
	return {"err": "unauthorized access", "data": None}

#you can specify specific methods (GET/POST) in function header instead of inside the functions as seen earlier
@app.route("/register", methods=['POST'])
def register_user():
	""" 
	register_user(): 

	payload: 
		{
			"first_name": string 
			"last_name": string 
			"email": string 
			"gender": string 
			"date_of_birth": timestamp 
			"hometown": string
			"password": string 
		}
	
	response: 
		{
			err: None 
			profile: {
				"first_name": string 
				"last_name": string 
				"email": string 
				"gender": string 
				"date_of_birth": timestamp
				"user_id": string 
			}
		}
	
	errors:

	missing fields err:
		{
			err: malformed request. missing fields 
			profile: None 
		}

	OR unique email err: 
		{
			err: account with that email already exists 
			profile: None
		}
	"""
	payload = request.get_json(force=True)
	try:
		first_name = payload["first_name"]
		last_name = payload["last_name"]
		email = payload["email"]
		gender = payload["gender"]
		date_of_birth = parser.parse(payload["date_of_birth"])
		hometown = payload["hometown"]
		password = payload["password"]
	except Exception as ex:
		print(ex)
		print("couldn't find all tokens") #this prints to shell, end users will not see this (all print statements go to shell)
		return {"err": "missing fields", "profile": None}
	cursor = conn.cursor()
	test = isEmailUnique(email)
	if test:
		print(cursor.execute("INSERT INTO Users (first_name, last_name, email, gender, hometown, date_of_birth, password) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}', '{6}')".format(first_name, last_name, email, gender, hometown, date_of_birth, password)))
		conn.commit()
		#log user in
		user = User()
		user.id = email
		flask_login.login_user(user)
		return {
			"err": None, 
			"profile": {
				"user_id": getUserFromEmail(email),
				"first_name": first_name, 
				"last_name": last_name, 
				"email": email,
				"hometown": hometown,
				"gender": gender, 
				"date_of_birth": date_of_birth
			}
		}
	else:
		print("the email was not unique")
		return {"err": "Account with that email already exists", "profile": None}


def getAlbumsPhotos(album_id):
	cursor = conn.cursor()
	cursor.execute("SELECT caption, photo_id, data, likes FROM Photo WHERE album_id = '{0}'".format(album_id))
	
	album_res = [] 
	for tup in cursor.fetchall(): 
		photo_id = int(tup[1])
		cursor.execute("SELECT T.name FROM Tag T, Tagged_Photos TP WHERE T.tag_id = TP.tag_id AND TP.photo_id = {0}".format(photo_id))
		album_res.append(
			{
				"photoId": photo_id,
				"caption": str(tup[0]), 
				"data": str(tup[2].decode()),
				"likes": tup[3],
				"tags": [t[0] for t in cursor.fetchall()]
			}
		)

	return album_res

def getUserIdFromEmail(email):
	cursor = conn.cursor()
	cursor.execute("SELECT user_id  FROM Users WHERE email = '{0}'".format(email))
	return cursor.fetchone()[0]

def isEmailUnique(email):
	#use this to check if a email has already been registered
	cursor = conn.cursor()
	if cursor.execute("SELECT email  FROM Users WHERE email = '{0}'".format(email)):
		#this means there are greater than zero entries with that email
		return False
	else:
		return True
#end login code



# begin get profile code 
@app.route("/profile/<int:user_id>", methods=['GET'])
def get_profile(user_id):
	"""
	get_profile():

	Response: 
	{ 
		userId: STRING,
		firstName: STRING,
		lastName: STRING, 
		albums: [
			{
				albumName: STRING
				creationDate: IDK what data type but will be converted into (‘mm/dd/yyyy’) in FE if not already in that form
			}	
		]
	}
	"""
	uid = user_id
	cursor = conn.cursor()
	# user info 
	cursor.execute("SELECT user_id, first_name, last_name FROM Users WHERE user_id = '{0}'".format(uid))
	user_info = cursor.fetchone()
	
	# albums for the user 
	cursor.execute("SELECT name, date_of_creation FROM Album WHERE user_id = '{0}'".format(uid))
	user_albums = [] 
	for tup in cursor.fetchall():
		user_albums.append(
			{
				"albumName": str(tup[0]),
				"creationDate": tup[1]
			}
		)
	return {"userId": user_info[0], "firstName": user_info[1], "lastName": user_info[2], "albums": user_albums}

#begin album creation code 

@app.route('/album/new', methods=['POST'])
def new_album():
	""" 
	new_album(): 

	payload: 
		{
			"name": string,
			"userID": string
		}
	
	response: 
		{
			"err" None, 
			"data": [{id: int, name: string, date: date}]
		}
	errors: 
	
	missing field: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.get_json(force=True) 
	date_of_creation = datetime.date.today()
	cursor = conn.cursor()
	try:
		name = payload["name"]
		uid = payload["userID"]
	except: 
		print("Missing fields")
		return {"err": "malformed request. missing fields", "data": None}
	cursor.execute('''INSERT INTO Album (name, date_of_creation, user_id) VALUES (%s, %s, %s )''' ,(name, date_of_creation, uid))
	conn.commit()
	cursor.execute('''SELECT album_id, name, date_of_creation FROM Album WHERE album_id = LAST_INSERT_ID()''')
	data = cursor.fetchone()
	return {"err": None, "albums": {"id": data[0], "name": data[1], "date": data[2]}}
# end album creation code 

# begin album list for user 
@app.route('/albums/<int:user_id>') 
def list_user_albums(user_id): 
	"""
	list_user_albums(): 

	{
		albums: [
			{
				"id": id
				"name": string, 
				"date": string
			}
		]
	}
	"""
	cursor = conn.cursor()
	cursor.execute('''SELECT album_id, name, date_of_creation FROM Album WHERE user_id = {0}'''.format(user_id))
	data = cursor.fetchall()
	albums = [] 
	for tuple in data: 
		albums.append(
			{
				"id": tuple[0],
				"name": tuple[1],
				"date": tuple[2]
			}
		)
	return {"err": None, "albums": albums}
# end album list for user 


# begin album photo list code 
@app.route('/albumPhotos/<int:album_id>', methods=['GET'])
def list_album_photos(album_id):
	""" 
	list_albums():

	{
		photos: [
			{
				photoId: STRING,
				caption: STRING,
				data: the picture in binary,
				likes: INTEGER 
			}, 
			...
		]
	}
	""" 
	return {"err": None, "photos": getAlbumsPhotos(album_id)}
# end of album list code 


#begin photo uploading code
# photos uploaded using base64 encoding so they can be directly embeded in HTML
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/newPhoto', methods=['POST'])
def upload_file():
	""" 
	upload_file(): 

	payload: 
	{
		email: string,
		albumId: STRING,
		photoId: STRING,
		caption: STRING,
		data: the picture in binary,
		Tags: [tag,] list of strings   
	}

	response: 
		{
			err: None 
			photos: [
				{
					photoId: STRING,
					caption: STRING,
					data: the picture in binary,
					likes: INTEGER,
					tags: [string]
				}, 
				...
			]
		}
	
	errors: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.get_json(force=True) 
	try:
		caption = payload["caption"]
		album_id = payload["albumId"]
		photo_data = payload["data"]
		tags = payload["tags"]
	except Exception as ex: 
		print(ex)
		return {"err": "malformed request. missing fields", "data": None}
	
	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Photo (caption, album_id, data) VALUES (%s, %s, %s)''' ,(caption, album_id, photo_data))
	conn.commit()

	# get the photo_id 
	cursor.execute('''SELECT LAST_INSERT_ID() FROM Photo''') 
	photo_id = cursor.fetchone()[0]

	# now, we need to add the tags 
	for tag in tags: 
		# lower case 
		tag = tag.lower()

		# check if the tag exists 
		cursor.execute("SELECT tag_id FROM Tag T WHERE T.name='{0}'".format(tag))
		fetched_tag = cursor.fetchone() 
		if fetched_tag: 
			tag_id = fetched_tag[0]
			cursor.execute('''UPDATE Tag SET quantity = quantity + 1''') 
			cursor.execute('''INSERT INTO Tagged_Photos (tag_id, photo_id) VALUES (%s, %s)''', (tag_id, photo_id))
		else:
			cursor.execute('''INSERT INTO Tag (name) VALUES (%s)''', (tag))

			# last inserted tag_id
			cursor.execute('''SELECT LAST_INSERT_ID() FROM Tag''') 
			tag_id = cursor.fetchone()[0]
			cursor.execute('''INSERT INTO Tagged_Photos (tag_id, photo_id) VALUES (%s, %s)''', (tag_id, photo_id))

		conn.commit()
	
	return {"err": None, "photos": getAlbumsPhotos(album_id)}
#end photo uploading code

### CODE FOR FRIENDS 

# begin add friend code 
@app.route('/addFriend', methods=['POST'])
# @flask_login.login_required
def add_friend():
	"""
	add_friend():

	payload: 
		{
			userId: STRING,
			friendUserId: STRING
		}
	
	response: 
		{
			err: None 
			data: "Successfully added new friend"
		}
	
	errors: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.get_json(force=True) 
	try: 
		user_id = payload["userId"]
		friend_id = payload["friendUserId"]
	except:
		print("missing params")
		return {"err": "malformed request. missing fields", "data": None}

	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Friends_With (uid, friend_id) VALUES (%s, %s)''' ,(user_id, friend_id))
	conn.commit()
	return { "err": None, "data": "Successfully added new friend"}
# end add friend code 

# begin list friend code 
@app.route('/friends/<int:user_id>', methods=['GET'])
# @flask_login.login_required
def list_friends(user_id):
	"""
	list_friends():
	
	response: 
		{
			err: None 
			data: [(first_name, last_name, gender, email)]
		}
	"""	
	uid = user_id
	cursor = conn.cursor()
	cursor.execute("SELECT user_id, first_name, last_name FROM Users WHERE user_id IN (SELECT friend_two_id FROM FRIENDS_WITH WHERE friend_one_id = '{0}')".format(uid))
	# the current friends 
	friend_list = []
	for tup in cursor.fetchall():
		friend_list.append(
			{
				"userId": int(tup[0]),
				"firstName": str(tup[1]),
				"lastName": str(tup[2])
			}
		)
	# now get suggested friends 
	friends_of_friends_query = """SELECT user_id, first_name, last_name FROM Users WHERE user_id IN (SELECT user_id FROM Users WHERE user_id IN (SELECT friend_two_id FROM FRIENDS_WITH WHERE friend_one_id = '{0}'))""".format(uid)
	cursor.execute(friends_of_friends_query)
	rec_list = [] 
	for tup in cursor.fetchall():
		rec_list.append(
			{
				"userId": int(tup[0]),
				"firstName": str(tup[1]),
				"lastName": str(tup[2])
			}
		)

	# if the friends list is empty then we will send them all possible people on the site 
	if not rec_list:
		friends_of_friends_query = """SELECT user_id, first_name, last_name FROM Users WHERE NOT user_id = '{0}'""".format(uid)
		cursor.execute(friends_of_friends_query)
		rec_list = [] 
		for tup in cursor.fetchall():
			rec_list.append(
				{
					"userId": int(tup[0]),
					"firstName": str(tup[1]),
					"lastName": str(tup[2])
				}
			)
	
	return {"err": None, "friends": friend_list, "suggestedFriends": rec_list }
# end list friend code 


### CODE FOR COMMENTS 

# function to get all comments 
def get_all_photo_comments(photo_id):
	cursor = conn.cursor()
	cursor.execute("SELECT (user_id, timestamp, text) FROM Comment WHERE photo_id = '{0}'".format(photo_id)) 

	photo_comments = []
	comments = cursor.fetchall()
	for tup in comments: 
		photo_comments.append(
			{
				"userId": tup[0],
				"timestamp": tup[1],
				"text": str(tup[2])
			}
		)
	return photo_comments

# begin add comment code 

@app.route('/newComment', methods=['POST'])
# @flask_login.login_required 
def new_comment():
	"""
	POST: /newComment

	Payload:
		{
			photoId: STRING,
			userId: STRING,
			comment: STRING
		}
	Response: 
		{
		comments: [
				{
					userId: int 
					timestamp: timestamp 
					text: string # the actual comment 
				},
				...
			]
		}
	"""
	payload = request.get_json(force=True)
	try: 
		photo_id = payload["photoId"]
		user_id = payload["userId"]
		comment = payload["comment"]
		timestamp = time.now()
	except:
		print("missing fields")
		return {"err": "malformed request. missing fields", "comments": None}

	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Comment (user_id, timestamp, text, photo_id) VALUES (%s,%s,%s,%s)''', (user_id, timestamp, comment, photo_id))
	return {"err": None, "comments": get_all_photo_comments(photo_id)}

# begin list comment codes 
@app.route('/comments/<int:photo_id>', methods=['GET'])
# @flask_login.login_required
def list_comments(photo_id):
	"""
	GET: /comments/photoId
	Response:
		{
		comments: [
				{
					userId: int 
					timestamp: timestamp 
					text: string # the actual comment 
				},
				...
			]
		}
	"""
	return {"err": None, "comments": get_all_photo_comments(photo_id)}
# end get comments code 


### CODE FOR LIKES 

def getPhotoLikes(photo_id):
	cursor = conn.cursor()
	cursor.execute("SELECT U.user_id, U.first_name, U.last_name, P.likes FROM Users U, Liked_Photo LP, Photo P WHERE LP.user_id = U.user_id AND LP.photo_id = P.photo_id AND LP.photo_id = {0}".format(photo_id))
	likes = cursor.fetchall() 
	num_likes = likes[0][3]

	photo_likes = []
	for likers in likes:
		photo_likes.append(
			{
				"userID": int(likers[0]), 
				"firstName": str(likers[1]),
				"lastName": str(likers[0])
			}
		)

	return {"users": photo_likes, "totalQnty": num_likes}
	


# begin like photo code 
@app.route('/photos/like', methods=['POST'])
def like_photo(): 
	""""
	like_photo():
		adds a like. 
		accepts {userID: , photoID: }
		returns {err: null, likes: {"users": [], "totalQnty": int}} 
	"""
	payload = request.get_json(force=True)
	try: 
		user_id = payload["userID"]
		photo_id = payload["photo_id"]
	except Exception as ex:
		print(ex)
		return {"err": "invalid request. missing fields", "likes": None}
	
	cursor = conn.cursor() 
	cursor.execute("INSERT INTO Liked_Photo (photo_id, user_id) VALUES (%s, %s)", (photo_id, user_id))
	cursor.execute("UPDATE Photo SET likes = likes + 1 WHERE photo_id = {0}".format(photo_id))
	conn.commit()

	return {"err": None, "likes": getPhotoLikes(photo_id)}
# end like photo code 

if __name__ == "__main__":
	#this is invoked when in the shell  you run
	#$ python app.py
	app.run(port=5000, debug=True)
