
from classes import TrainnigSettings
import aaib_util as util
import numpy as np
import json
from IPython.display import clear_output
from tensorflow.keras import models
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Dense,
    Conv1D,
    MaxPooling1D,
    Flatten,
    Dropout,
    Bidirectional,
    LSTM,
)
import tensorflow as tf


# get_ipython().run_line_magic('matplotlib', 'inline')
# get_ipython().run_line_magic('config', "InlineBackend.figure_format = 'svg'")
# get_ipython().run_line_magic('load_ext', 'autoreload')
# get_ipython().run_line_magic('autoreload', '2')


def testHeLstm(testModel):

    #!/usr/bin/env python
    # coding: utf-8

    # # A3T (Authorship Attribution of Ancient Texts, 2020)
    # Authors: <a href="mailto:razmalkau@gmail.com">Raz Malka</a> and <a href="mailto:shoham39@gmail.com">Shoham Yamin</a>
    # under the supervision of <a href="mailto:vlvolkov@braude.ac.il">Prof. Zeev Volkovich</a> and <a href="mailto:r_avros@braude.ac.il@braude.ac.il">Dr. Renata Avros</a>.\
    # Source:</br> https://github.com/RazMalka/A3T/
    #
    # # 5. Train BiLSTM Model - ELMo

    # ### 5.1 - General
    # Let us import the required modules for this notebook:

    # In[1]:

    gpus = tf.config.experimental.list_physical_devices('GPU')
    if gpus:
        try:
            for gpu in gpus:
                tf.config.experimental.set_memory_growth(gpu, True)

        except RuntimeError as e:
            print(e)

    def predict_with_confidence(model, book):
        prediction_matrix = model.predict((book))
        prediction_vector = np.mean(prediction_matrix, axis=0)
        # print("Confidences Vector:", prediction_vector*100)

        prediction = np.argmax(prediction_vector)
        confidence = util.truncate(prediction_vector[prediction]*100, 3)
        return prediction, confidence

    print("2")
    print(testModel)
    model_path = 'models\\bible\\' + testModel["selectedModel"]  # CHANGE ME
    required_model = models.load_model(model_path)
    predicted_books = testModel["testBooks"]  # CHANGE ME

    preds = []
    confs = []
    for i in range(len(predicted_books)):
        fp = open(util.file_path + "\\npy_elmo\\embedded\\" +
                  predicted_books[i] + ".npy", "rb")
        book = np.load(fp)
        pred, conf = predict_with_confidence(required_model, book)
        preds.append(pred)
        confs.append(conf)

    with open("modelsClasses.json", "r") as jsonFile:
        modelsClass = json.load(jsonFile)

    classLable1 = modelsClass[testModel["selectedModel"]]["classLable1"]
    classLable2 = modelsClass[testModel["selectedModel"]]["classLable2"]
    booksClass1 = modelsClass[testModel["selectedModel"]]["trainClass1"]
    booksClass2 = modelsClass[testModel["selectedModel"]]["trainClass2"]
    return predicted_books, preds, confs, classLable1, classLable2, booksClass1, booksClass2
