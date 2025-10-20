import os
import sys
from src.exception import CustomException
from src.logger import logging
import pandas as pd
import numpy as np
from dataclasses import dataclass
import shutil

from sklearn.model_selection import train_test_split
from src.components.data_transformation import DataTransformation
from src.components.data_transformation import DataTransformationConfig

@dataclass
class DataIngesionConfig:
    train_data_path: str =os.path.join('artifact', 'train.csv')
    test_data_path: str =os.path.join('artifact', 'test.csv')
    raw_data_path: str =os.path.join('artifact', 'fertilizer.csv')
    rag_docs_path: str=os.path.join('artifact', 'rag_docs')

class DataIngesion:
    def __init__(self):
        self.data_ingestion_config = DataIngesionConfig()
        
    def initiate_data_ingestion(self):
        logging.info("Data Ingestion Method and Component")
        try:
            df=pd.read_csv("Ferlilizer_Data\Fertilizer Prediction.csv")
            df.columns = df.columns.str.strip()
            df.columns = df.columns.str.replace(" ", "_")
            df["soil_health_score"] = (
                df['Temparature']*0.2 +
                df['Humidity']*0.1 +
                df['Moisture']*0.2 +
                df['Nitrogen']*0.2 +
                df['Potassium']*0.15 +
                df['Phosphorous']*0.15
                )
            logging.info("Data Readed Sucessfully")
            os.makedirs(os.path.dirname(self.data_ingestion_config.train_data_path), exist_ok=True)
            
            df.to_csv(self.data_ingestion_config.raw_data_path, index=False, header=True)
            logging.info("raw data loaded")
            
            train_set, test_set=train_test_split(df, test_size=0.2, random_state=42)
            train_set.to_csv(self.data_ingestion_config.train_data_path, index=False, header=True)
            
            test_set.to_csv(self.data_ingestion_config.test_data_path, index=False, header=True)
            
            logging.info("Ingestion of data is Completed")
            
            return (
                self.data_ingestion_config.train_data_path,
                self.data_ingestion_config.test_data_path
                # self.data_ingestion_config.raw_data_path
            )
        except Exception as e:
            raise CustomException(e,sys)
    def rag_ingestion_initialize(self, source_folder="Ferlilizer_Data\Raw_pdfs"):
        logging.info("Rag_pipeline Startd")
        try:
            os.makedirs(self.data_ingestion_config.rag_docs_path, exist_ok=True)
            for file in os.listdir(source_folder):
                if file.endswith(".pdf"):
                    src=os.path.join(source_folder, file)
                    dst=os.path.join(self.data_ingestion_config.rag_docs_path, file)
                    if not os.path.exists(dst):
                        shutil.copy(src, dst)
                        
            logging.info("PDF copied to artifact")
            return self.data_ingestion_config.rag_docs_path
        except Exception as e:
            raise CustomException(e, sys)
        
                        
                        
    
if __name__=="__main__":
    obj=DataIngesion()
    train_df, test_df=obj.initiate_data_ingestion()
    docs_rag=obj.rag_ingestion_initialize()
    
    
    data_transformation=DataTransformation()
    data_transformation.initate_data_transformation(train_df, test_df)
    data_transformation.initate_rag_transformation(docs_rag)