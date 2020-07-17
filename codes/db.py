# -*- coding: utf-8 -*-
"""
Created on Tue Jun 30 15:07:36 2020

@author: COMDEP
"""
import os
import json
import pymongo
from bson.objectid import ObjectId
from flask import Flask
from flask import request
import pandas as pd
import pprint
import csv
import json
from flask import Flask, render_template, jsonify
import pandas
app = Flask(__name__)



client = pymongo.MongoClient("mongodb+srv://Nushmia:2A0pnYhaqlTcbBGJ@cluster0-qo56j.mongodb.net/beyond-talk?retryWrites=true&w=majority")
db = client['beyond-talk']
collection = db['conversations']
@app.route('/get')
def get():
  
    msg=[]
    for x in collection.distinct("conversation.message",{}):
       
        msg.append(x)
        
   
    data=jsonify(msg)
    cursor = collection.find()
    mongo_docs = list(cursor)

# restrict the number of docs to export
    mongo_docs = mongo_docs[:50] # slice the list
    print ("total docs:", len(mongo_docs))

# create an empty DataFrame for storing documents
    docs = pandas.DataFrame(columns=[])

# iterate over the list of MongoDB dict documents
    for num, doc in enumerate(mongo_docs):
        # convert ObjectId() to str
        doc["_id"] = str(doc["_id"])
        # get document _id from dict
        doc_id = doc["_id"]

# create a Series obj from the MongoDB dict
    series_obj = pandas.Series( doc, name=doc_id )

# append the MongoDB Series obj to the DataFrame obj
    docs = docs.append(series_obj)


    print ("\nexporting Pandas objects to different file types.")
    print ("DataFrame len:", len(docs))
    # export MongoDB documents to a CSV file
    docs.to_csv("object_rocket.csv", ",") # CSV delimited by commas
    # export MongoDB documents to CSV
    csv_export = docs.to_csv(sep=",") # CSV delimited by commas
    print ("\nCSV data:", csv_export)


   
    
    return data
  
@app.after_request
def after_request(response):
    header=response.headers
    header['Access-Control-Allow-Origin']='*'
    return response  
@app.route('/api/upload', methods = ['POST'])
def upload_file():
    file = request.files['file']
    print(file)
    return "done"

if __name__ == '__main__':
    
    app.run()
