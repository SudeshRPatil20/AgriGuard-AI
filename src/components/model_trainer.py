import os
import sys
from src.logger import logging
from src.exception import CustomException
from src.utils import save_obj, evalution_model

from dataclasses import dataclass
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier,AdaBoostClassifier
from sklearn.svm import SVR
# from sklearn.linear_model import Ridge,Lasso
# from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from sklearn.metrics import accuracy_score, classification_report, ConfusionMatrixDisplay, precision_score, recall_score, f1_score, roc_auc_score, roc_curve

from sklearn.model_selection import RandomizedSearchCV
# from catboost import CatBoostClassifier
# from xgboost import XGBClassifier
import warnings

@dataclass
class ModelTrainingConfig:
    train_model_file_path =os.path.join('artifact', 'model.pkl')
    
class ModelTraining:
    def __init__(self): 
        self.model_train_config=ModelTrainingConfig()
        
    def initiate_model_trainer(self, train_array, test_array):
        try:
            logging.info("Split Train and Test input data")
            x_train, y_train, x_test, y_test=(
                train_array[:, :-1],
                train_array[:, -1],
                test_array[:, :-1],
                test_array[:, -1]                
            )
            
            models={
                "Decision Tree":DecisionTreeClassifier(),
                "Random Forest":RandomForestClassifier()
            }
            
            model_report:dict=evalution_model(X_train=x_train, X_test=x_test, y_train=y_train, y_test=y_test, models=models)
            
            best_model_score=max(sorted(model_report.values()))
            
            best_model_name=list(model_report.keys())[
                list(model_report.values()).index(best_model_score)
            ]
            
            best_model= models[best_model_name]
            
            if best_model_score< 0.6:
                raise CustomException("No best model found")
            logging.info(f"Best found model on both training and testing dataset")
            
            save_obj(
                file_path=self.model_train_config.train_model_file_path,
                obj=best_model
            )
            
            predicted=best_model.predict(x_test)
            accuracy=accuracy_score(y_test, predicted)
            return accuracy
        
        
        except Exception as e:
            raise CustomException(e, sys)
