from flask import Flask
import requests
import os
import sys
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


DEV = 'GDOCS_DOC' not in os.environ

if not DEV:
	GDOCS_DOC = os.environ['GDOCS_DOC']
	GDOCS_KEY = os.environ['GDOCS_KEY'];

def build_url(tab, cell_range, doc, key):
	return ('https://sheets.googleapis.com/v4/spreadsheets/' + doc + '/values/' 
		+ tab  + '!' + cell_range + '?key=' + key);


@app.route("/finance")
def finance():
	if DEV:
		return '{"homeOwnership":"0.999","summaryDone":"0","transferMade":"0"}'

	response = requests.get(build_url('Finance', 'A1:B10', GDOCS_DOC, GDOCS_KEY))
	data = response.json()['values'];

	return { row[0]: row[1] for row in data }


@app.route("/dates")
def dates():
	if DEV:
		return '''
[
  { "date": "January 28", "event": "Urodziny Krzyska" },
  { "date": "October 12", "event": "Rocznica slubu" }
]
		'''

	response = requests.get(build_url('Dates', 'A1:B100', GDOCS_DOC, GDOCS_KEY))
	data = response.json()['values'];

	return json.dumps( [{'date': row[0], 'event': row[1]} for row in data] )


@app.route("/priorities")
def priorities():
	if DEV:
		return '''
[
  "Kupno mieszkania",
  "Rozliczyc podatek"
]
		'''

	response = requests.get(build_url('Priorities', 'A1:A10', GDOCS_DOC, GDOCS_KEY))
	data = response.json()['values'];

	return json.dumps( [row[0] for row in data] )




if __name__ == "__main__":
	app.run()
