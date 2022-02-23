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

import flask
from flask import Flask, Response, request, render_template, redirect, url_for
from flaskext.mysql import MySQL
import flask_login

#for image uploading
import os, base64

# for albums and comments 
import datetime
import time

mysql = MySQL()
app = Flask(__name__)
app.secret_key = 'super secret string'  # Change this!

#These will need to be changed according to your creditionals
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'photoshare'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
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

@app.route('/login', methods=['GET'])
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
			data: {
				"first_name": string 
				"last_name": string 
				"email": string 
				"gender": string 
				"date_of_birth": timestamp 
			}
		}
	errs: 
	
	invalid creds err: { err: invalid credentials, data: None }

	"""
	payload = flask.request.json
	email = payload['email']
	cursor = conn.cursor()
	# check if email is registered
	if cursor.execute("SELECT password, first_name, last_name, email, gender, date_of_birth FROM Users WHERE email = '{0}'".format(email)):
		data = cursor.fetchall()
		pwd = str(data[0][0])
		if payload['password'] == pwd:
			user = User()
			user.id = email
			flask_login.login_user(user) # okay login in user
			# return a dictionary with info about the user 
			return {
				"err": None, 
				"data": {
					"first_name": str(data[1][0]), 
					"last_name": str(data[2][0]), 
					"email": str(data[3][0]),
					"gender": str(data[4][0]),
					"date_of_birth": data[5][0]
				}
			}
	# information did not match
	return {"err": "invalid credentials", "data": None}

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
			"password": string 
		}
	
	response: 
		{
			err: None 
			data: {
				"first_name": string 
				"last_name": string 
				"email": string 
				"gender": string 
				"date_of_birth": timestamp 
			}
		}
	
	errors:

	missing fields err:
		{
			err: malformed request. missing fields 
			data: None 
		}

	OR unique email err: 
		{
			err: account with that email already exists 
			data: None
		}
	"""
	payload = flask.request.json 
	try:
		first_name = payload["first_name"]
		last_name = payload["last_name"]
		email = payload["email"]
		gender = payload["gender"]
		date_of_birth = payload["date_of_birth"]
		password = payload["password"]
	except:
		print("couldn't find all tokens") #this prints to shell, end users will not see this (all print statements go to shell)
		return {"err": "missing fields", "message": None}
	cursor = conn.cursor()
	test = isEmailUnique(email)
	if test:
		print(cursor.execute("INSERT INTO Users (first_name, last_name, email, gender, date_of_birth, password) VALUES ('{0}', '{1}', '{2}', '{3}', '{4}', '{5}')".format(first_name, last_name, email, gender, date_of_birth, password)))
		conn.commit()
		#log user in
		user = User()
		user.id = email
		flask_login.login_user(user)
		return {
			"err": None, 
			"data": {
				"first_name": first_name, 
				"last_name": last_name, 
				"email": email,
				"gender": gender, 
				"date_of_birth": date_of_birth
			}
		}
	else:
		print("the email was not unique")
		return {"err": "Account with that email already exists", "data": None}

def getAlbumsPhotos(album_id):
	cursor = conn.cursor()
	cursor.execute("SELECT caption, photo_id, data FROM Photo WHERE album_id = '{0}'".format(album_id))
	return cursor.fetchall() #NOTE list of tuples, [(imgdata, pid), ...]

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

#begin album creation code 

@app.route('/album/new', methods=['POST'])
@flask_login.login_required
def new_album():
	""" 
	new_album(): 

	payload: 
		{
			"name": string 
		}
	
	response: 
		{
			"err" None, 
			"data": (album_id, name, date_of_creation)
		}
	errors: 
	
	missing field: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.json 
	uid = getUserIdFromEmail(flask_login.current_user.id)
	date_of_creation = datetime.date.today()
	try:
		name = payload["name"]
	except: 
		print("Missing fields")
		return {"err": "malformed request. missing fields", "data": None}
	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Album (name, date_of_creation, user_id) VALUES (%s, %s, %s ) returning (album_id, name, date_of_creation)''' ,(name, date_of_creation, uid))
	conn.commit()
	return {"err": None, "data": {"album_id": cursor.fetchone()[0]}}
# end album creation code 


# begin album list code 
@app.route('/album/list', methods=['GET'])
@flask_login.login_required
def new_album():
	""" 
	list_albums():

	response: 
		{
			"err": None, 
			"data": [(album_id, first_name, last_name, date_of_creation)]
		}
	"""
	uid = getUserIdFromEmail(flask_login.current_user.id)
	cursor = conn.cursor()
	cursor.execute("SELECT (album_id, first_name, last_name, date_of_creation) FROM Album WHERE user_id = '{0}'".format(uid))
	return {"err": None, "data": cursor.fetchall()}
# end of album list code 


#begin photo uploading code
# photos uploaded using base64 encoding so they can be directly embeded in HTML
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

@app.route('/photo/upload', methods=['POST'])
@flask_login.login_required
def upload_file():
	""" 
	upload_file(): 

	payload: 
		{
			"caption": string 
			"album_id": int 
			"photo": blob
		}
	
	response: 
		{
			err: None 
			data: [(caption, photo_id, data)]
		}
	
	errors: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.json 
	try:
		caption = payload["caption"]
		album_id = payload["album_id"]
		imgfile = request.files['photo']
	except: 
		return {"err": "malformed request. missing fields", "data": None}
	photo_data =imgfile.read()
	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Photo (caption, album_id, data) VALUES (%s, %s, %s )''' ,(caption, album_id, photo_data))
	conn.commit()
	return {"err": None, "data": getAlbumsPhotos(album_id)} 
#end photo uploading code

#begin photo list for specific album code 
@app.route('/photo/list', methods=['GET'])
@flask_login.login_required
def list_photos():
	""" 
	list_photos():

	query_params: album_id

	response: 
		{
			"err": None, 
			data: [(caption, photo_id, data)]
		}

	errors: {"err": "malformed request. missing query param", "data": None}
	"""
	try: 
		album_id = request.args.get("album_id")
	except:
		return {"err": "malformed request. missing query param", "data": None}
	
	return {"err": None, "data": getAlbumsPhotos(album_id)}
#end photo list for specific album code 


# begin add friend code 
@app.route('/friend/add', methods=['POST'])
@flask_login.login_required
def add_friend():
	"""
	add_friend():

	payload: 
		{
			"friend_id": int 
		}
	
	response: 
		{
			err: None 
			data: "Successfully added new friend"
		}
	
	errors: {"err": "malformed request. missing fields", "data": None}
	"""
	payload = request.json 
	try: 
		friend_id = payload["friend_id"]
	except:
		print("missing params")
		return {"err": "malformed request. missing fields", "data": None}

	uid = getUserIdFromEmail(flask_login.current_user.id)
	cursor = conn.cursor()
	cursor.execute('''INSERT INTO Friends_With (uid, friend_id) VALUES (%s, %s, %s )''' ,(uid, friend_id))
	conn.commit()
	return { "err": None, "data": "Successfully added new friend"}
# end add friend code 

# begin list friend code 
@app.route('/friend/list', methods=['GET'])
@flask_login.login_required
def list_friends():
	"""
	list_friends():
	
	response: 
		{
			err: None 
			data: [(first_name, last_name, gender, email)]
		}
	"""	
	uid = getUserIdFromEmail(flask_login.current_user.id)
	cursor = conn.cursor()
	cursor.execute("SELECT (first_name, last_name, gender, email) FROM Users WHERE user_id IN (SELECT (friend_id) FROM FRIENDS_WITH WHERE user_id = '{0}')".format(uid))
	return {"err": None, "data": cursor.fetchall()}
# end list friend code 



if __name__ == "__main__":
	#this is invoked when in the shell  you run
	#$ python app.py
	app.run(port=5000, debug=True)
