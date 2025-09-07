from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import pandas as pd
import math
import logging
import os

app = Flask(__name__)
cors_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
FRONTEND_ORIGIN = "https://howefficientisyourbuilding.onrender.com"
if FRONTEND_ORIGIN:
    cors_origins.append(FRONTEND_ORIGIN)

CORS(app,origins=cors_origins)
    
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "nyc_energy_water.db")

@app.route('/senddata', methods=['GET'])
def senddata():
    try:
        page = int(request.args.get('page',1))
    except (ValueError,TypeError) as e:
        return jsonify({'error': 'Invalid page number'}),400
    
    if page<1:
        return jsonify({'error': 'Invalid page number'}),400
    
    if page>10000:
        return jsonify({'error': 'Invalid page number'}),400
    offset = (page-1)*100
    try:
        with sqlite3.connect(DB_PATH) as connect:
            df = pd.read_sql_query("SELECT * FROM nyc_energy_water LIMIT ? OFFSET ? ", connect, params=(100,offset))
            return jsonify(df.fillna('null').to_dict(orient='records'))
    except sqlite3.Error as e:
        logger.error(f"Database error in senddata: {e}")
        return jsonify({'error': 'An error occured'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in senddata: {e}")
        return jsonify({'error': 'An error occurred'}), 500
    

@app.route('/getlbcount')
def getlbcount():
    try:
        with sqlite3.connect(DB_PATH) as connect:
            df = pd.read_sql_query("SELECT COUNT(*) as total FROM nyc_energy_water ", connect)
            count = math.ceil(df.iloc[0]['total']/100)
            return jsonify({"count":count})
    except sqlite3.Error as e:
        logger.error(f"Database error in getlbcount: {e}")
        return jsonify({'error': 'An error occured'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in getlbcount: {e}")
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/searchalike',methods=['GET'])
def searchalike():
    try:
        searchBar = request.args.get('query','').strip()
        if not searchBar or len(searchBar)>100:
            return jsonify({'error': 'Invalid search query'}),400
        
        with sqlite3.connect(DB_PATH) as connect:
            query = "SELECT * FROM nyc_energy_water WHERE Address_1 LIKE ? LIMIT 10"
            search_params = f"%{searchBar}%"
            df = pd.read_sql_query(query,connect,params=(search_params,))
            return jsonify(df.fillna('null').to_dict(orient='records'))
    except sqlite3.Error as e:
        logger.error(f"Database error in searchalike: {e}")
        return jsonify({'error': 'An error occured'}), 500
    except Exception as e:
        logger.error(f"Unexpected error in searchalike: {e}")
        return jsonify({'error': 'An error occurred'}), 500
    
@app.after_request
def after_request(response):
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


