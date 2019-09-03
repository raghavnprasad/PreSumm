#!/usr/bin/env python
"""
    API entrance
"""
from __future__ import division

import argparse
import os, glob
from pathlib import Path

import random
from others.logging import init_logger

from train_abstractive import validate_abs, train_abs, baseline, test_abs, test_text_abs, load_models_abs
from train_extractive import train_ext, validate_ext, test_ext
from prepro import data_builder
from summarizer import load_model


from flask import Flask, render_template, request,Response, jsonify
app = Flask(__name__)
from flask_cors import CORS
CORS(app)


# globals initialization
args, device_id, cp, step, predictor = load_model()
print(args.task, args.mode) 


print(" model initialized")
CAMPAIGN_TEXT='../sample_campaigns/*.txt'
files=glob.glob(CAMPAIGN_TEXT)
print("No. sample campaigns found {}".format(len(files)))

@app.route('/random', methods=['GET', 'POST'])
def random_pick():
    if request.method == 'GET':
        res={}
        try:
            idx= random.randrange(0, len(files))
            print(files[idx])
            with open(files[idx]) as f:
                res['txt']=f.read().rstrip()
            p = Path(files[idx])
            html_name= str(p.with_suffix('')) +'.html'
            print(html_name)
            with open(html_name) as f:
                res['html_raw']= f.read()
        except:
            print("Error ")
        return jsonify(res)
        #return Response(res, mimetype='text/plain')

@app.route('/summary', methods=['GET', 'POST'])
def translate():
    if request.method == 'POST':
        # user inputs
        req = request.json
        print(req)

        # api call
        res={}
        if len(req['src']) >0:
            print("request src "+str(req['src']))

            #globals: args, device_id, cp, step, predictor

            try:
                data_builder.str_format_to_bert(  req['src'], args, '../bert_data_test/cnndm.test.0.bert.pt') 
                args.bert_data_path= '../bert_data_test/cnndm'
                tgt, time_used=test_text_abs(args, device_id, cp, step, predictor)

                # some postprocessing 

                sentences = tgt.split('<q>')
                sentences = [sent.capitalize() for sent in sentences]
                sentences = '. '.join(sentences).rstrip()
                sentences = sentences.replace(' ,', ',')
                sentences = sentences+'.'
                res['tgt'] = sentences
                print("completed {} ".format(time_used))
            except:
                print("process error, return empty str")

        return jsonify(res)


    return render_template('index.html')

# HTTP Errors handlers
@app.errorhandler(404)
def url_error(e):
    return """
    Wrong URL!
    <pre>{}</pre>""".format(e), 404


@app.errorhandler(500)
def server_error(e):
    return """
    An internal error occurred: <pre>{}</pre>
    See logs for full stacktrace.
    """.format(e), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    app.run(host='0.0.0.0', port=port, debug=True, use_reloader=True)
    app.run(debug=True)

