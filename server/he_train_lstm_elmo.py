
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
from json import JSONEncoder

# get_ipython().run_line_magic('matplotlib', 'inline')
# get_ipython().run_line_magic('config', "InlineBackend.figure_format = 'svg'")
# get_ipython().run_line_magic('load_ext', 'autoreload')
# get_ipython().run_line_magic('autoreload', '2')


class ModelEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


def trainHeLstm(modelSettings: TrainnigSettings):

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

    # Also, we'd like to define three lists - training books, validation books and predicted books.\
    # For that, Exodus and Canticum books were chosen - where Exodus is supposedly written by Moses, and Canticum by David.

    # In[2]:

    # training_books_cl0 = ["Genesis", "Exodus","Numeri"]  # ~ 83,000 words by moses
    # training_books_cl1 = ["Psalmi", "Jeremia","Jesaia"]  # ~ 88,000 words not by moses

    # shohamChange--
    training_books_cl0 = modelSettings.trainClass1
    training_books_cl1 = modelSettings.trainClass2
    classifications = [modelSettings.classLable1, modelSettings.classLable2]

    # shohamEndChange--
    # predicted_books = ["Deuteronomium", "Iob", "Leviticus",
    #                    "Esra", "Nehemia", "Josua"]  # Might be authors

    # classifications = ["Moses", "Not Moses"]

    # ### 5.2 - Data Preparation
    # Well-organized data is a necessity in the way to create a working deep neural network.\
    # Here, we load the data generated in the last task <mark>Word Embedding</mark>, and prepare the input data and labels for the models.\
    # Labels are initialized deliberately to be the index of the supposed author in the authors list defined in <mark><i>aaib_util.py</mark></i>

    # In[3]:

    def prepare_labels(data, label):
        return np.full(data.shape[0], label)

    def merge_sets(set1, set2):
        return np.concatenate((set1, set2))

    # Prepare data and labels of a given set
    def prepare_set(book_list, label):
        x_set, y_set = None, None
        for i in range(len(book_list)):
            fp = open(util.file_path + "\\npy_elmo\\embedded\\" +
                      book_list[i] + ".npy", "rb")
            data = np.load(fp)
            labels = prepare_labels(data, label)
            x_set = data if x_set is None else merge_sets(x_set, data)
            y_set = labels if y_set is None else merge_sets(y_set, labels)
        return x_set, y_set

    x_train_cl0, y_train_cl0 = prepare_set(training_books_cl0, 0)
    x_train_cl1, y_train_cl1 = prepare_set(training_books_cl1, 1)

    x_train, y_train = merge_sets(
        x_train_cl0, x_train_cl1), merge_sets(y_train_cl0, y_train_cl1)

    # Take a look at the shapes of the training and validation data:

    # In[4]:

    print("x_train:", x_train.shape)
    print("y_train:", y_train.shape)

    # ### 5.3 - Turn Scalar Targets into Binary Categories
    # Our classification model has multiple classes, and we want them distributed in a binary matrix.\
    # We use keras' <mark>to_categorical</mark> utility method to transform our label data before passing it to model.

    # In[5]:

    # Turn our scalar targets into binary categories
    num_classes = len(classifications)

    y_train = to_categorical(y_train, num_classes)

    # ### 5.4 - Predictions
    # Let us define two functions which will serve us for generating and interpreting predictions from a given model:

    # In[16]:

    # def predict_with_confidence(model, book):
    #     prediction_matrix = model.predict((book))
    #     prediction_vector = np.mean(prediction_matrix, axis=0)
    #     # print("Confidences Vector:", prediction_vector*100)

    #     prediction = np.argmax(prediction_vector)
    #     confidence = util.truncate(prediction_vector[prediction]*100, 3)
    #     return prediction, confidence

    # def predict_style_similarity(model):
    #     for b in predicted_books:
    #         fp = open(util.file_path +
    #                   "npy_fasttext\\embedded\\" + b + ".npy", "rb")
    #         book = np.load(fp)
    #         prediction, confidence = predict_with_confidence(model, book)
    #         print(b, "is determined to be",
    #               classifications[prediction], "with confidence of", confidence, "%")

    # ### 5.5 - BiLSTM Model
    # Let us define a Bi-Directional Long Short-Term Memory model:

    # In[7]:

    def define_hybrid_model(filters=[500, 500, 500], kernel_size=[3, 6, 12]):
        model = Sequential()
        model.add(Conv1D(filters=filters[0], kernel_size=kernel_size[0], padding="same",
                         activation='relu', input_shape=(x_train.shape[1], x_train.shape[2])))
        model.add(MaxPooling1D(1, padding="same"))
        model.add(Conv1D(
            filters=filters[1], kernel_size=kernel_size[1], padding="same", activation='relu'))
        model.add(MaxPooling1D(1, padding="same"))
        model.add(Bidirectional(
            LSTM(units=75, return_sequences=True), merge_mode='concat'))
        model.add(Bidirectional(LSTM(units=75)))
        model.add(Dropout(0.5))
        model.add(Dense(num_classes, activation='sigmoid'))
        return model
    defined_bilstm_model = define_hybrid_model()

    # In[8]:

    defined_bilstm_model.summary()

    # Our model's structure is defined, but it is not trained yet. It should now be compiled and fitted over the training and validation data.\
    # Below is our training loop, which will run for <mark>N_iter</mark> iterations that maintain an <mark>accuracy threshold</mark>.

    # In[18]:

    # Define parameters
    current_iter = 0
    N_iter = 1
    accuracy = 0
    accuracy_threshold = 0.92
    top_bilstm_model = None
    top_bilstm_model_accuracy = 0

    # Training loop
    while current_iter < N_iter:
        model = models.clone_model(defined_bilstm_model)
        model.compile(loss='categorical_crossentropy',
                      optimizer=Adam(lr=modelSettings.modelLearningRate),
                      metrics=['acc'])
        history = model.fit(x_train, y_train, epochs=modelSettings.modelEpochs,
                            verbose=1, validation_split=0.15, batch_size=modelSettings.modelBatchSize)
        train_loss, train_accuracy = model.evaluate(
            x_train, y_train, verbose=0)

        if train_accuracy > top_bilstm_model_accuracy:
            top_bilstm_model = model
            top_bilstm_model_accuracy = train_accuracy

        if train_accuracy > accuracy_threshold:
            # mean_values = predict_style_similarity(model, mean_values)
            # clear_output(wait=True)
            print("Completed Iteration {}/{} with Accuracy of {}%".format(
                current_iter + 1, N_iter, util.truncate(train_accuracy*100, 3)))
            current_iter = current_iter + 1
        else:
            print("Failed Iteration {}/{} with Accuracy of {}%".format(current_iter +
                                                                       1, N_iter, util.truncate(train_accuracy*100, 3)))

    print("Achieved Accuracy:", top_bilstm_model_accuracy*100, "%")

    # In[19]:

    # ### 5.6 - BiLSTM Predictions and Saving
    # Now that our BiLSTM model is trained, we should check it out and let it predict supposed authorship of different books.
    # Also, when having a well-trained model, we will want to deploy it to perform inference on new texts.\
    # Once we have a trained model that we are happy with, it should be saved to disk:

    # In[20]:

    # predict_style_similarity(top_bilstm_model, mean_values)

    # In[21]:

    top_bilstm_model.save('models\\bible\\' + modelSettings.modelName)

    with open("modelsClasses.json", "r") as jsonFile:
        modelsClass = json.load(jsonFile)

    modelsClass[modelSettings.modelName] = modelSettings
    with open("modelsClasses.json", "w") as jsonFile:
        json.dump(modelsClass, jsonFile,  cls=ModelEncoder)

    # ### Bonus - Loading a Model
    # As the models were saved to disk, they can be loaded back into memory as follows:

    # In[ ]:

    # top_bilstm_model = models.load_model('models\\bible\\bilstm_model_elmo')

    # And evaluated as such:

    # In[ ]:

    # top_bilstm_model.evaluate(x_train, y_train)

    # In[ ]:
