import os
import sys
from src.exception import CustomException
from src.logger import logging
import numpy as np
import pandas as pd
import dill

from sklearn.metrics import accuracy_score, classification_report, ConfusionMatrixDisplay, precision_score, recall_score, f1_score, roc_auc_score, roc_curve


def save_obj(file_path, obj):
    try:
        dir_path=os.path.dirname(file_path)
        
        os.makedirs(dir_path, exist_ok=True)
        
        with open(file_path, 'wb') as file_obj:
            dill.dump(obj, file_obj)
            
    except Exception as e:
        raise CustomException(e, sys)

def evalution_model(X_train, y_train, X_test, y_test, models):
    try:
        report = {}
        for name, model in models.items():
            logging.info(f"Training model: {name}")
            model.fit(X_train, y_train)
            
            y_test_pred = model.predict(X_test)
            test_accuracy = accuracy_score(y_test, y_test_pred)
            
            logging.info(f"{name} test accuracy: {test_accuracy}")
            report[name] = test_accuracy
            
        return report
    except Exception as e:
        raise CustomException(e, sys)
        
def load_obj(file_path):
    try:
        with open(file_path, 'rb') as file_obj:
            return dill.load(file_obj)
    except Exception as e:
        raise CustomException(e, sys)
    