from flask import Flask
import requests
import os
import sys
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


DEV = 'GDOCS_DOC' not in os.environ

if not DEV:
	GDOCS_DOC = os.environ['GDOCS_DOC']
	GDOCS_KEY = os.environ['GDOCS_KEY'];

def build_url(tab, doc, key):
	return ('https://sheets.googleapis.com/v4/spreadsheets/' + doc + '/values/' 
		+ tab  + '!A1:B10?key=' + key);


@app.route("/finance")
def finance():
	if DEV:
		return '{"homeOwnership":"0.999","summaryDone":"0","transferMade":"0"}'

	response = requests.get(build_url('Finance', GDOCS_DOC, GDOCS_KEY))
	data = response.json()['values'];

	return { row[0]: row[1] for row in data }


if __name__ == "__main__":
	app.run()
