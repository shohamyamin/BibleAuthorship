class TrainnigSettings:
    def __init__(self, settings):
        self.classLable1 = settings["classLable1"]
        self.classLable2 = settings["classLable2"]
        self.modelTrainingSequenceLen = settings["modelTrainingSequenceLen"]
        self.modelLearningRate = settings["modelLearningRate"]
        self.modelBatchSize = settings["modelBatchSize"]
        self.modelEpochs = settings["modelEpochs"]
        self.modelName = settings["modelName"]
        self.trainClass1 = settings["trainClass1"]
        self.trainClass2 = settings["trainClass2"]
