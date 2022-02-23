# Table of Contents 

1. [Register, Login, Logout](#authentication)
    - [Register](#register)
    - [Login](#login)
    - [Logout](#logout)
2. [Creating and Getting Albums](#albums)
    - [Creating Albums](#new-album)
    - [Listing Albums](#list-albums)
3. [Uploading and Listing Photos](#Photos)
    - [Uploading Photos](#upload-photo)
    - [Listing Photos](#Listing-Album-Photos)
4. [Adding and listing Friends](#Friends)
    - [Add Friend](#adding-friend)
    - [List Friends](#listing-frined)


# Authentication

## Register 

**endpoint:** '/register' 


**method:** 'POST'

**Payload:** 
```
{
    "first_name": string 
    "last_name": string 
    "email": string 
    "gender": string 
    "date_of_birth": timestamp 
    "password": string 
}
```

**Response:** 
```
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
```
	
**Errors:** 

1. missing fields err:
```
{
    err: malformed request. missing fields 
    data: None 
}
```
2. unique email err
```
{
    err: account with that email already exists 
    data: None
}
```

## Login 

**endpoint:** '/login' 


**method:** 'POST' 


**Payload:** 
```
{
    "email": string 
    "password": string 
}
```

**Response:** 
```
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
```
	
**Errors:** 

1. 	invalid creds err: 
```
{ err: invalid credentials, data: None }
```

## Logout 

**endpoint:** '/logout' 


**method:** 'GET' 

**Response:** 
```
{
    "err": None, 
    "data": "User successfully logged out"
}
```

# Albums

## New Album 

**endpoint:** '/album/new'
**method:** 'POST' 

**Payload:** 
```
{
    "name": string 
}
```

**Response:** 
```
{
    "err" None, 
    "data": (album_id, name, date_of_creation)

}
```


## List Albums 

Note: This lists the albums of the logged in user 

**endpoint:** '/album/list' 


**method:** 'GET' 

**Response:**
```
{
    "err": None, 
    "data": [(album_id, first_name, last_name, date_of_creation)]
}
```

# Photos 

## Uploading Photo 
Note: The response is to list all of the photos from the album

**endpoint:** '/photo/upload'


**method:** 'POST' 

**Payload:** 
```
{
    "caption": string 
    "album_id": int 
    "photo": blob
}
```

**Response:** 
```
{
    err: None 
    data: [(caption, photo_id, data)]
}
``` 

**Errors:** 
```
{"err": "malformed request. missing fields", "data": None}
```

## Listing Album Photos 
Note: Lists photos from specified album

enpoint: '/photo/list'
**method:** 'GET' 

Query Param:
```
?album_id={id}
```

**Response:** 
```
{
    err: None 
    data: [(caption, photo_id, data)]
}
```

**Errors:** 
```
{"err": "malformed request. missing query param", "data": None}
```

# Friends 

## Adding Friend 

**endpoint:** '/friend/add'
**method:** 'POST' 

**Payload:** 
```
{
    "friend_id": int 
}
```

**Response:** 
```
{
    err: None 
    data: "Successfully added new friend"
}
``` 

**Errors:** 
```
{"err": "malformed request. missing fields", "data": None}
```

## Listing Friends 
Note: This lists friends for the logged in user 

**endpoint:** '/friend/list'


**method:** 'GET' 

**Response:** 
```
{
    err: None 
    data: [(first_name, last_name, gender, email)]
}
``` 

