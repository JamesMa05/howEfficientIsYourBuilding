from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import math

app = Flask(__name__)
CORS(app,origins=["http://localhost:5173"])
@app.route('/senddata', methods=['GET'])
def senddata():
    page = int(request.args.get('page',0))
    offset = (page-1)*100
    connect = sqlite3.connect("nyc_energy_water.db")
    df = pd.read_sql_query("SELECT * FROM nyc_energy_water LIMIT 100 OFFSET ? ", connect, params=(offset,))
    connect.close()
    return jsonify(df.fillna('null').to_dict(orient='records'))

@app.route('/getlbcount')
def getlbcount():
    connect = sqlite3.connect("nyc_energy_water.db")
    df = pd.read_sql_query(f"SELECT COUNT(*) as total FROM nyc_energy_water ", connect)
    connect.close()
    count = math.ceil(df.iloc[0]['total']/100)
    return jsonify({"count":count})

if(__name__ == '__main__'):
    app.run(debug=True)
