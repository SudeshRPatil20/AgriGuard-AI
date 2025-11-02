import os
import sys
from src.exception import CustomException
from src.logger import logging
# from src.components.data_ingestion import DataIngesion
from src.utils import save_obj

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings


from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.preprocessing import LabelEncoder
import numpy as np
import pandas as pd
from dataclasses import dataclass

# from src.components.data_ingestion import DataIngesion

@dataclass
class DataTransformationConfig:
    preprocessor_obj_file_path = os.path.join('artifact', "preprocessor.pkl")
    rag_obj_file_path = os.path.join('artifact', 'vectorstore')
class DataTransformation:
    def __init__(self):
        self.data_transformation_config = DataTransformationConfig()
        
    def get_transformed_object(self):
        try:
            num_feature=['Temparature','Humidity','Moisture','Nitrogen','Potassium','Phosphorous','soil_health_score']
            cat_feature=['Soil_Type', 'Crop_Type']
            
            num_pipeline= Pipeline(
                steps=[
                    ("scalar", StandardScaler())
                ]
            )
            cat_pipeline=Pipeline(
                steps=[
                    ("ohe_encoder", OneHotEncoder(handle_unknown='ignore')),
                    # ("scalar", StandardScaler(with_mean=False))
                ]
            )
            
            logging.info(f"Catagorical columns:{cat_feature}")
            logging.info(f"numerical_feature: {num_feature}")
            
            preprocessor=ColumnTransformer(
                [
                    ("num_pipeline", num_pipeline, num_feature),
                    ("cat_pipeline", cat_pipeline, cat_feature)
                ]
            )
            logging.info("Pipeline processed sucessfully")
            return preprocessor
        except Exception as e:
            raise CustomException(e, sys)
    
    def initate_data_transformation(self, train_pth, test_path):
        try:
            train_df=pd.read_csv(train_pth)
            test_df=pd.read_csv(test_path)
            
            logging.info("Read train test data completed")
            logging.info("Read test completed")
            
            preprocessor_obj=self.get_transformed_object()
            le=LabelEncoder()
            
            target_column="Fertilizer_Name"
            
            input_feature_train_df=train_df.drop(columns=[target_column], axis=True)
            target_column_train_df=train_df[target_column]
            target_column_train_df=le.fit_transform(target_column_train_df)
            
            input_feature_test_df=test_df.drop(columns=[target_column], axis=True)
            target_column_test_df=test_df[target_column]
            target_column_test_df=le.transform(target_column_test_df)
            
            logging.info(f"train and test transformed")
            logging.info("Applying the preprocessor on the data")
            
            input_feature_train_array=preprocessor_obj.fit_transform(input_feature_train_df)
            input_feature_test_array=preprocessor_obj.transform(input_feature_test_df)
            
            train_arr=np.c_[
                input_feature_train_array, np.array(target_column_train_df)
            ]
            test_arr=np.c_[
                input_feature_test_array, np.array(target_column_test_df)
            ]
            
            logging.info(f"Saved Preprocessing object")
            
            save_obj(
                file_path=self.data_transformation_config.preprocessor_obj_file_path,
                obj=preprocessor_obj
            )
            
            return (
                train_arr,
                test_arr,
                self.data_transformation_config.preprocessor_obj_file_path,
            )
        except Exception as e:
            raise CustomException(e, sys)
        
    def initate_rag_transformation(self, docs_path : str):
    
        try:
            logging.info("Started Rag Application")
            if not os.path.exists(docs_path):
                raise FileNotFoundError(f"Document folder not found: {docs_path}")
            
            all_docs=[]
            for file in os.listdir(docs_path):
                if file.endswith(".pdf"):
                    pdf_file=os.path.join(docs_path, file)
                    loader=PyPDFLoader(pdf_file)
                    all_docs.extend(loader.load())
            logging.info(f"all pages form {len(all_docs)} loaded")
            
            splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunk=splitter.split_documents(all_docs)
            logging.info(f"created {len(chunk)} text chunks")
            
            embedding=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            vector_store=FAISS.from_documents(chunk, embedding)
            
            os.makedirs(self.data_transformation_config.rag_obj_file_path, exist_ok=True)
            vector_store.save_local(self.data_transformation_config.rag_obj_file_path)
            logging.info(f"Vector DB saved at {self.data_transformation_config.rag_obj_file_path}")
            
            return self.data_transformation_config.rag_obj_file_path
            
            
        
        except Exception as e:
            raise CustomException(e, sys)
            
            
    
        
