# -*- coding: utf-8 -*-
"""
Created on Tue Jun 16 17:14:15 2020

@author: KHC
"""


import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
#import matplotlib.pyplot as plt
from sklearn.naive_bayes import MultinomialNB
from sklearn import metrics
from sklearn.feature_extraction.text import TfidfTransformer
from unidecode import unidecode
import re
from sklearn.pipeline import Pipeline
import pickle
import json

from flask import Flask, render_template, jsonify

 
app = Flask(__name__)

loaded_model = pickle.load(open('nb_tfidf.sav', 'rb'))
new_data= pd.read_csv('data.csv')
new_data.dropna(axis=0, inplace=True)   # dropping all NAN valued rows



# In[31]:
def clean_text(x):
    x_ascii = unidecode(x)
    x_clean = special_character_removal.sub('',x_ascii)
    return x_clean


special_character_removal = re.compile(r'[^A-Za-z\.\-\?\!\,\#\@\% ]',re.IGNORECASE)
new_data['clean_text'] = new_data['message'].apply(lambda x: clean_text(str(x)))


new_data['clean_text']= new_data['clean_text'].fillna("something")

input_data=new_data.clean_text.values


predicted_new_data = loaded_model.predict(input_data)
#h_detected=[item for item in new_data if item==1]
#predicted_new_data.shape

h_detected=[]
for i in range (0,len(predicted_new_data)):
#for i in range (0,len()):
    if predicted_new_data[i]==1:
        print (i)
        h_detected.append(new_data.iloc[i,[3,2,4,5,6]].values)
        
bad_df = pd.DataFrame(h_detected)

my_json_arr=bad_df.to_json(orient='records')
my_json_arr=my_json_arr.replace("\"0\":", "\"id\":");
my_json_arr=my_json_arr.replace("\"1\":", "\"message\":");
my_json_arr=my_json_arr.replace("\"2\":", "\"name\":");
my_json_arr=my_json_arr.replace("\"3\":", "\"gender\":");
my_json_arr=my_json_arr.replace("\"4\":", "\"date\":");
data=my_json_arr.replace('\\', '')

@app.after_request
def after_request(response):
    header=response.headers
    header['Access-Control-Allow-Origin']='*'
    return response



@app.route('/index')
@app.route('/')
def index():
  return render_template('index.html')

@app.route('/index_get_data')
def index_get_data():
  # Assume data comes from somewhere else
  
#  final_data=jsonify(data)
  
  return data

 
 
if __name__ == '__main__':
  app.run()
