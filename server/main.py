from classes import TrainnigSettings
from flask import request, Flask, jsonify
from flask_restful import reqparse, abort, Api, Resource
from flask_cors import CORS, cross_origin
from he_train_lstm_elmo import trainHeLstm
import os
import json
from he_test_lstm_elmo import testHeLstm
import numpy as np


app = Flask(__name__)
cors = CORS(app)
api = Api(app)

# app.config['CORS_HEADERS'] = 'Content-Type'


class Models(Resource):
    def get(self):
        models = os.listdir('.\\models\\bible')
        print(models)
        return {"models": models}


class Analyze(Resource):

    def post(self):
        body = request.get_json(force=True)

        print("body", body)

        return analyzeTexts(body)


class Train(Resource):
    def post(self):

        ModelSettings = request.get_json(force=True)
        print("ModelSettings", ModelSettings)
        return train(TrainnigSettings(ModelSettings))


api.add_resource(Models, "/api/models")
api.add_resource(Analyze, "/api/analyze")
api.add_resource(Train, "/api/train")


def analyzeTexts(textsAndModel):
    print("textsAndModel")
    print(textsAndModel)
    books, preds, confs, lable1, lable2, booksClass1, booksClass2 = testHeLstm(
        textsAndModel)

    return json.dumps({"books": books, "preds": preds, "confs": confs, "classLable1": lable1, "classLable2": lable2, "trainClass1": booksClass1, "trainClass2": booksClass2}, default=np_encoder)


def np_encoder(object):
    if isinstance(object, np.generic):
        return object.item()


# export interface IModelSettings {
#   classLable1: string;
#   classLable2: string;
#   modelTrainingSequenceLen: number;
#   modelLearningRate: number;
#   modelBatchSize: number;
#   modelEpochs: number;
#   modelName: string;
# }
def train(modelSettings: TrainnigSettings):

    print("do trainin by the settings")
    trainHeLstm(modelSettings)
    # call 5_1_he_train_lstm_elmo.py that will do the training for lstm Elmo MOdel with the parameters from TrainnigSettings
    f = open('graphData.json',)

    # returns JSON object as
    # a dictionary
    data = json.load(f)
    return data


if __name__ == "__main__":
    app.run(debug=False)
