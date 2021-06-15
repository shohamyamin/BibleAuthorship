import matplotlib.pyplot as plt
import math
import os

# Truncate a float into n decimal places


def truncate(f, n):
    return math.floor(f * 10 ** n) / 10 ** n

# A history plot of training and validation accuracy or loss


def plot_metric(history, metric):
    train_metrics = history.history[metric]
    val_metrics = history.history['val_'+metric]
    epochs = range(1, len(train_metrics) + 1)
    plt.plot(epochs, train_metrics)
    plt.plot(epochs, val_metrics)
    plt.title('Training and validation ' + metric)
    plt.xlabel("Epochs")
    plt.ylabel(metric)
    plt.legend(["train_"+metric, 'val_'+metric])
    plt.show()

# Get a list of all files in directory and subdirectories as a relative path


def list_files(root, preappend='', replace=''):
    file_list = []
    for path, subdirs, files in os.walk(root):
        for name in files:
            file_list.append(preappend + os.path.join(path,
                                                      name).replace(root, '').replace(replace, ''))
    return file_list

# Get a list of all files related to al-ghazali


def list_files_al_ghazali():
    return list_files(file_path + 'txt\\al_ghazali\\', 'al_ghazali\\', '.txt')

# Get a list of source books (t-1 / cl-0)


def list_source_al_ghazali():
    file_list = []
    for f in list_files_al_ghazali():
        if ('\\t1\\' in f):
            file_list.append(f)
    return file_list

# Get a list of alternative books (t-2 / cl-1)


def list_alternative_al_ghazali():
    file_list = []
    for f in list_files_al_ghazali():
        if ('\\t2\\' in f):
            file_list.append(f)
    return file_list

# Get a list of predicted books (t-3 / cl-2)


def list_predicted_al_ghazali():
    file_list = []
    for f in list_files_al_ghazali():
        if ('\\t3\\' in f):
            file_list.append(f)
    return file_list


file_path = os.getcwd()
books = ["Genesis", "Exodus", "Leviticus", "Numeri", "Deuteronomium",
         "Josua", "Judices", "Samuel_I", "Samuel_II", "Reges_I", "Reges_II",
         "Jesaia", "Jeremia", "Ezechiel", "Hosea", "Joel", "Amos", "Obadia",
         "Jona", "Micha", "Nahum", "Habakuk", "Zephania", "Haggai", "Sacharia",
         "Maleachi", "Psalmi", "Iob", "Proverbia", "Ruth", "Canticum", "Ecclesiastes",
         "Threni", "Esther", "Daniel", "Esra", "Nehemia", "Chronica_I", "Chronica_II"]
authors = ["Moses", "David", "Samuel"]
