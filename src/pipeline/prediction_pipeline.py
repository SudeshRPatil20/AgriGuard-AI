import sys
import pandas as pd
import numpy as np
from src.utils import load_obj
from src.exception import CustomException
from src.logger import logging
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.chains.combine_documents import create_stuff_documents_chain
# from langchain.chains import create_retrieval_chain
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.chains import create_retrieval_chain

import os

from dotenv import load_dotenv
# os.environ['GOOGLE_API_KEY'] = os.getenv('GOOGLE_API_KEY')
load_dotenv()


class PredictPipeline:
    def __init__(self):
        pass
    
    def predict(self, features):
        try:
            model_path = os.path.join("artifact", "model.pkl")
            preprocessor = os.path.join("artifact", "preprocessor.pkl")
            model = load_obj(file_path=model_path)
            preprocessor = load_obj(file_path=preprocessor)
            data_scaled = preprocessor.transform(features)
            preds = model.predict(data_scaled)
            pred_label = int(preds[0])
            
            a = {
                0: 'Urea', 
                1: 'DAP', 
                2: '14-35-14', 
                3: '28-28', 
                4: '17-17-17', 
                5: '20-20',  
                6: '10-26-26'
            }
            
            self.ans = a[pred_label]
            return self.ans
        
        except Exception as e:
            raise CustomException(e, sys)
    
    
    # Commented out RAG-related functionality

    def rag_predict(self):
        try:
            vector_db_path = "artifact/vectorstore"
            embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
            
            # Load vectorstore
            vectorstore = FAISS.load_local(vector_db_path, embedding, allow_dangerous_deserialization=True)
            
            # Prepare query dynamically
            query = f"How to use this {self.ans} fertilizer?"
            
            result=vectorstore.similarity_search(query=query)
            return result[0].page_content
            
            # # Setup LLM
            # llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro")
            
            # # Prompt template
            # prompt = ChatPromptTemplate.from_template("""
            # You are an agricultural assistant. 
            # Answer the farmer’s question using the provided context only.
            # <context>
            # {context}
            # </context>
            # Question: {input}
            # """)
            
            # # Chain creation
            # document_chain = create_stuff_documents_chain(llm, prompt)
            # retriever = vectorstore.as_retriever()
            # retriever_chain = create_retrieval_chain(retriever, document_chain)
            
            # # Get answer
            # response = retriever_chain.invoke({"input": query})
            # return response['answer']

        except Exception as e:
            raise CustomException(e, sys)
    


class CustomData:
    def __init__(self, Temperature,
                 Humidity,
                 Moisture,
                 Soil_Type,
                 Crop_Type,
                 Nitrogen,
                 Potassium,
                 Phosphorous):
        
        # 🔹 Convert numeric fields to float
        self.Temperature = float(Temperature)
        self.Humidity = float(Humidity)
        self.Moisture = float(Moisture)
        self.Soil_Type = Soil_Type
        self.Crop_Type = Crop_Type
        self.Nitrogen = float(Nitrogen)
        self.Potassium = float(Potassium)
        self.Phosphorous = float(Phosphorous)
        
        # 🔹 Now arithmetic works fine
        self.soil_health_score = (
            (self.Temperature * 0.2) +
            (self.Humidity * 0.1) +
            (self.Moisture * 0.2) +
            (self.Nitrogen * 0.2) +
            (self.Potassium * 0.15) +
            (self.Phosphorous * 0.15)
        )
        
    def get_data_as_data_frame(self):
        try:
            custom_data_input_dict = {
                'Temparature': [self.Temperature],
                'Humidity': [self.Humidity],
                'Moisture': [self.Moisture],
                'Soil_Type': [self.Soil_Type],
                'Crop_Type': [self.Crop_Type],
                'Nitrogen': [self.Nitrogen],
                'Potassium': [self.Potassium],
                'Phosphorous': [self.Phosphorous],
                'soil_health_score': [self.soil_health_score]
            }
            return pd.DataFrame(custom_data_input_dict)
        
        except Exception as e:
            raise CustomException(e, sys)
