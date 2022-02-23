# CS460 

# PLEASE PLEASE always use virtual env when you're working on the backend

## Instructions for activating virtual env
1. cd into backend
2. run ```source ./env/bin/activate```
3. **IF THIS IS THE FIRST TIME** you're running the flask app, make sure you do a ```pip install -r requirements.txt```. 
4. Otherwise, you're good to go.

If the step doesn't work, make sure you've got virtualenv installed: ```pip install virtualenv```. 

## Instruction for updating requirements.txt
1. cd into backend 
2. Make sure you activated virtual env (see above!)
3. run ```pip freeze > requirements.txt```
4. That's all