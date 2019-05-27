import pickle
import json
import cv2
import os
import numpy as np
import xml.etree.cElementTree as ET
import base64
import socket
import shutil
import pyrebase
# from flask_mail import Mail, Message
from xml.dom import minidom
from flask import Flask, jsonify, request, Response, render_template , send_from_directory, redirect, url_for, session
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, emit
from gevent.pywsgi import WSGIServer
from PIL import Image
from StringIO import StringIO
from datetime import datetime
from django.http import HttpResponseRedirect

# print(cv2.__version__)

STATIC_DIR = './'
TEMPLATE_DIR = './'

#read configs
with open('data.json') as f:
	data = json.load(f)
	STATIC_DIR = data['staticDir']
	TEMPLATE_DIR = data['templateDir']

config = {'apiKey': 'AIzaSyCFbQehxrjn8eSprAr8JmSwEZSREIQbiN4',
          'authDomain': 'puzl-84135.firebaseapp.com',
   	  		'databaseURL': 'https://puzl-84135.firebaseio.com',
    	  	'projectId': 'puzl-84135',
    	  	'storageBucket': 'puzl-84135.appspot.com',
    	  	'messagingSenderId': '6480789:web:a83caec25e8d012e'}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
app = Flask(__name__, static_folder = STATIC_DIR, template_folder = TEMPLATE_DIR, static_url_path = '')
file_path = os.path.abspath(os.getcwd())+"/database.db"
# mail=Mail(app)
# app.config['MAIL_SERVER']='smtp.gmail.com'
# app.config['MAIL_PORT'] = 465
# app.config['MAIL_USERNAME'] = 'gagikabovyan98@gmail.com'
# app.config['MAIL_PASSWORD'] = '055780730Gag12'
# app.config['MAIL_USE_TLS'] = False
# app.config['MAIL_USE_SSL'] = True
# mail = Mail(app)

socketio = SocketIO(app)
API = 'http://172.20.16.192:7000/'
dirName = 'XMLs/'
users = {}
alreadyChecked = []
trackerTypes = ['BOOSTING', 'MIL', 'KCF','TLD', 'MEDIANFLOW', 'GOTURN', 'MOSSE', 'CSRT']
APP__ROOT = os.path.dirname(os.path.abspath(__file__))

#initialize user dict 
def initData(userKey):
	global users
	global alreadyChecked
	if users == {}:
		with open('users.pkl', 'rb') as input:
			users = pickle.load(input)
			input.close()
	users[userKey] = {}
	users[userKey]['trackers'] = []
	users[userKey]['rects'] = []
	users[userKey]['classes'] = []
	users[userKey]['countXML'] = 1
	users[userKey]['count'] = 1
	users[userKey]['frameID'] = 1
	users[userKey]['videoName'] = ''
	users[userKey]['countFrames'] = 1
	users[userKey]['isHaveAcc'] = False
	users[userKey]['singlePerm'] = False
	users[userKey]['isInitTrackers'] = False
	alreadyChecked.append(userKey)
	with open('users.pkl', 'wb') as output:
		pickle.dump(users, output, pickle.HIGHEST_PROTOCOL)
		output.close()
	createDir('./XMLs/' + userKey)

#home /
@app.route('/', methods=['GET', 'POST'])
@cross_origin()
def home():
	global alreadyChecked
	global users
	# msg = Message('Hello', sender = 'gagikabovyan98@gmail.com', recipients = ['gagik-abovyan@inbox.ru'])
	# msg.body = "Hello Flask message sent from Flask-Mail"
	# mail.send(msg)alreadyChecked.append(userKey)
	if request.remote_addr in alreadyChecked:
		createDir('XMLs')
		initData(request.remote_addr)
		users[request.remote_addr]['isHaveAcc'] = True
		return render_template('index.html'),201, {'Access-Control-Allow-Origin': '*'}
	else:
		initData(request.remote_addr)
		return render_template('index.html'),201, {'Access-Control-Allow-Origin': '*'}
	
@app.route('/close', methods=['GET'])
@cross_origin()
def close():
	global users
	users[request.remote_addr]['isHaveAcc'] = False
	return 'close'

# login page users
@app.route('/login', methods=['GET', 'POST'])
@cross_origin()
def login():
	global users
	return render_template('index.html'),200, {'Access-Control-Allow-Origin': '*'}

# login users
@app.route('/sign-in', methods=['GET', 'POST'])
def signIn():
	global users
	if request.method == 'POST':
		email = request.json['email']
		password = request.json['pass']
		try:
			auth.sign_in_with_email_and_password(email, password)
			users[request.remote_addr]['isHaveAcc'] = True
			return json.dumps({'success':True})
		except:
			return json.dumps({'success':False})
	return json.dumps({'success':False})

# register users
@app.route('/register', methods=['GET', 'POST'])
def register():
	global users
	if request.method == 'POST':
		email = request.json['email']
		password = request.json['pass']
		try:
			auth.create_user_with_email_and_password(email, password)
			users[request.remote_addr]['isHaveAcc'] = True
			return json.dumps({'success':True})
		except:
			return json.dumps({'success':False})
	else:
		return json.dumps({'success':False})

# user page
@app.route('/user', methods=['GET', 'POST'])
@cross_origin()
def user():
	global users
	global API
	# return render_template('index.html'),200, {'Access-Control-Allow-Origin': '*'}
	userKey = request.remote_addr
	try:
		print(users[userKey])
	except:
		home()
		return redirect(url_for("login"))
	if users[userKey]['isHaveAcc'] is True:
		return render_template('index.html'),200, {'Access-Control-Allow-Origin': '*'}
	else:
		return redirect(url_for("login"))

# track objects /track
@app.route('/track',methods = ['POST'])
@cross_origin()
def data():
	global trackerTypes
	global users
	global dirName
	global count 
	innerClasses = []
	userKey = request.remote_addr
	url = request.json['data']['url']
	canvasWidth = request.json['data']['width']
	canvasHeihgt = request.json['data']['height']
	frame = readb64(url)
	users[userKey]['frameID'] += 1
	bboxes = []
	if users[userKey]['count'] == 0:
		if users[userKey]['isInitTrackers'] is False:
			users[userKey]['trackers'] = []
		for val in users[userKey]['rects']:
			height, width, channels = frame.shape
			val['x'] = val['x'] * float(width) / canvasWidth
			val['y'] = val['y'] * float(height) / canvasHeihgt
			val['width'] = val['width'] * float(width) / canvasWidth
			val['height'] = val['height'] * float(height) / canvasHeihgt
			rect = (val['x'], val['y'], val['width'], val['height'])
			bboxes.append(rect)
		if users[userKey]['isInitTrackers'] is True:
			oldTrackerSize = len(users[userKey]['trackers'])
			for index in range(len(users[userKey]['trackers']), len(bboxes)):
				bbox = bboxes[index]
				users[userKey]['trackers'].append(createTrackerByName(trackerTypes[2]))
				users[userKey]['count'] += 1
			for i in range(oldTrackerSize, len(users[userKey]['trackers'])):
				users[userKey]['trackers'][i].init(frame, bboxes[i])
			users[userKey]['isInitTrackers'] = False
		else:		
			for bbox in bboxes:
				users[userKey]['trackers'].append(createTrackerByName(trackerTypes[2]))
				users[userKey]['count'] += 1
			for i in range(len(users[userKey]['trackers'])):
				users[userKey]['trackers'][i].init(frame, bboxes[i])	
	rectParam = []
	rectForReturn = []
	for i in range(len(users[userKey]['trackers'])): 
		success, box = users[userKey]['trackers'][i].update(frame)
		height, width, channels = frame.shape 
		p1 = (int(box[0]), int(box[1]))
		p2 = (int(box[0]) + int(box[2]), int(box[1]) + int(box[3]))
		if success is True:
			rectParam.append(box)
		else:
			del users[userKey]['trackers'][i]
			del users[userKey]['classes'][i]
			del users[userKey]['rects'][i]
			break
			
	for rect in rectParam:
		rectForReturn.append((int(rect[0]), int(rect[1]), int(rect[2]), int(rect[3])))
	temps = []
	for rect in rectForReturn:
		if rect[0] > 0:
			temps.append(rect)
	for temp in temps:
		counter = users[userKey]['countXML']
		filePath = dirName + '/' + userKey + '/' + users[userKey]['videoName'] + '/file' + str(counter) + '_ID-' + str(users[userKey]['frameID'])  + '.xml'
		fileName = 'image_' + str(users[userKey]['frameID']) + '.png'
		name = users[userKey]['classes'][rectForReturn.index(temp)]
		innerClasses.append(name)
		if temp[0] == temps[0][0]:
			height, width = frame.shape[:2]
			writeXML(filePath, fileName, name, str(width), str(height), str(temp[0]), str(temp[1]), str(temp[2]), str(temp[3]))
		if temp[0] != temps[0][0]:
			appendXML(filePath, name, str(temp[0]), str(temp[1]), str(temp[2]), str(temp[3]))
		if temp[0] == temps[-1][0]:
			users[userKey]['countXML'] += 1
	for i in range(len(rectForReturn)):
		rect = rectForReturn[i]
		newX = float(rect[0]) * canvasWidth / float(width)
		newY = float(rect[1]) * canvasHeihgt / float(height)
		newWidth = float(rect[2]) * canvasWidth / float(width)
		newHeight = float(rect[3]) * canvasHeihgt / float(height)
		rect = (int(newX), int(newY), int(newWidth), int(newHeight))
		rectForReturn[i] = rect
	return json.dumps({'success':True, 'rects':rectForReturn, 'className':innerClasses})


#upload file /upload
@app.route('/upload', methods = ['POST'])
@cross_origin()
def uploadFile():
	global dirName
	userKey = request.remote_addr
	try:
		file = request.files['file']
	except:
		file = None
	target = os.path.join(STATIC_DIR)
	if not os.path.isdir(target):
		os.mkdir(target)
	fileName = str(file.filename) + '-' + datetime.now().strftime('%Y%m%d_%H%M%S')
	destination = '/'.join([target, fileName])
	file.save(destination)
	users[userKey]['rects'][:] = []
	users[userKey]['trackers'] = []
	users[userKey]['videoName'] = fileName
	users[userKey]['originalName'] = str(file.filename)
	path = dirName + userKey + '/' + fileName
	createDir(path)
	return json.dumps({'fileName':fileName})

#export files /export
@app.route('/export', methods = ['GET'])
@cross_origin()
def exportFiles():
	global users
	global STATIC_DIR
	userKey = request.remote_addr
	currentDir = dirName + userKey + '/' + users[userKey]['videoName']
	videoPath = STATIC_DIR + users[userKey]['videoName']
	cap = cv2.VideoCapture(videoPath)
	xmls = os.listdir(currentDir)
	framesID = []
	for xml in xmls:
		framesID.append(int(xml.split('-')[1].split('.')[0]))
	cap = cv2.VideoCapture(videoPath)
	count = 0
	# Read until video is completed
	while(cap.isOpened()):
		count +=1
		# Capture frame-by-frame
		ret, frame = cap.read()
		if ret == True:
			# Display the resulting frame
			if count in framesID:
				path = currentDir + '/' + 'image_' + str(count) + '.png'
				num_rows, num_cols = frame.shape[:2]
				rotation_matrix = cv2.getRotationMatrix2D((num_cols/2, num_rows/2), -90, 1)
				img_rotation = cv2.warpAffine(frame, rotation_matrix, (num_cols, num_rows))
				cv2.imwrite(path, img_rotation)
		else: 
			break
	cap.release()
	cv2.destroyAllWindows()
	zipName = users[userKey]['videoName']
	zipDir(STATIC_DIR + '/' + zipName, currentDir)
	return json.dumps({'zipLink':zipName})

#socket
@socketio.on('add-data')
@cross_origin()
def sendMessage(message):
	global users
	userKey = request.remote_addr
	for mes in message:
		users[userKey]['classes'].append(mes['name'])
	if len(users[userKey]['trackers']) > 0:
		for i in range(len(message)):
			users[userKey]['rects'].append(message[0])
		users[userKey]['isInitTrackers'] = True
		users[userKey]['count'] = 0
		return json.dumps({'data':'ok'})
	users[userKey]['rects'] = message
	users[userKey]['count'] = 0
	socketio.emit({'d':'d'})
	return  json.dumps({'data':'ok'})

# parse base64 data 
def readb64(base64_string):
	sbuf = StringIO()
	sbuf.write(base64.b64decode(base64_string))
	pimg = Image.open(sbuf)
	return cv2.cvtColor(np.array(pimg), cv2.COLOR_RGB2BGR)

#create dir by name
def createDir(dirName):
	if not os.path.exists(dirName):
		os.makedirs(dirName)

#zip dir by name
def zipDir(zipName, dirName):
	shutil.make_archive(zipName, 'zip', dirName)

#for create and write xml
def writeXML(filePath, fileName, className, width, height, xmin, ymin, xmax, ymax):
	root = ET.Element('anotation')
	ET.SubElement(root, 'folder').text = 'frames'
	ET.SubElement(root, 'filename').text = fileName
	ET.SubElement(root, 'path').text = 'path'
	source = ET.SubElement(root, 'source')
	ET.SubElement(source, 'database').text = 'Unknown'
	size = ET.SubElement(root, 'size')
	ET.SubElement(size, 'width').text = width 
	ET.SubElement(size, 'height').text = height
	ET.SubElement(size, 'depth').text = '1' 
	ET.SubElement(root, 'segmented').text = '1'
	objectXML = ET.SubElement(root, 'object')
	ET.SubElement(objectXML, 'name').text = className
	ET.SubElement(objectXML, 'pose').text = 'Unspecified'
	ET.SubElement(objectXML, 'truncated').text = '1'  
	ET.SubElement(objectXML, 'difficult').text = '1' 
	bndbox = ET.SubElement(objectXML, 'bndbox')
	ET.SubElement(bndbox, 'xmin').text = xmin
	ET.SubElement(bndbox, 'ymin').text = ymin
	ET.SubElement(bndbox, 'xmax').text = xmax
	ET.SubElement(bndbox, 'ymax').text = ymax
	tree = ET.ElementTree(root)
	tree.write(filePath)

#for append already created xml
def appendXML(fileName, className, xmin, ymin, xmax, ymax):
	tree = ET.parse(fileName)
	root = tree.getroot()
	objectXML = ET.SubElement(root, 'object')
	ET.SubElement(objectXML, 'name').text = className
	ET.SubElement(objectXML, 'pose').text = 'Unspecified'
	ET.SubElement(objectXML, 'truncated').text = '1'  
	ET.SubElement(objectXML, 'difficult').text = '1' 
	bndbox = ET.SubElement(objectXML, 'bndbox')
	ET.SubElement(bndbox, 'xmin').text = xmin
	ET.SubElement(bndbox, 'ymin').text = ymin
	ET.SubElement(bndbox, 'xmax').text = xmax
	ET.SubElement(bndbox, 'ymax').text = ymax
	tree = ET.ElementTree(root)
	tree.write(fileName)

#for crteate tracker by type
def createTrackerByName(trackerType):
	global trackerTypes
	global multiTracker
	# Create a tracker based on tracker name
	if trackerType == trackerTypes[0]:
		tracker = cv2.TrackerBoosting_create()
	elif trackerType == trackerTypes[1]: 
		tracker = cv2.TrackerMIL_create()
	elif trackerType == trackerTypes[2]:
		tracker = cv2.TrackerKCF_create()
	elif trackerType == trackerTypes[3]:
		tracker = cv2.TrackerTLD_create()
	elif trackerType == trackerTypes[4]:
		tracker = cv2.TrackerMedianFlow_create()
	elif trackerType == trackerTypes[5]:
		tracker = cv2.TrackerGOTURN_create()
	elif trackerType == trackerTypes[6]:
		tracker = cv2.TrackerMOSSE_create()
	elif trackerType == trackerTypes[7]:
		tracker = cv2.TrackerCSRT_create()
	else:
		tracker = None
	return tracker

# after request headers
@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

if __name__ == '__main__':
	
	# app.run(debug=True, threaded=True, host='172.20.16.192', port=7000)
	http_server = WSGIServer(('172.20.16.192', 7000), app)
	http_server.serve_forever()
