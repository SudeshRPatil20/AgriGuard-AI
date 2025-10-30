from fastapi import FastAPI, Form
from pydantic import BaseModel
from src.pipeline.prediction_pipeline import CustomData, PredictPipeline

app = FastAPI(title="Fertilizer Prediction API")

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Welcome to the Fertilizer Prediction API"}

# Prediction endpoint
@app.post("/prediction")
def predict_datapoint(
    temperature: float = Form(...),
    humidity: float = Form(...),
    moisture: float = Form(...),
    crop_type: str = Form(...),
    soil_type: str = Form(...),
    nitrogen: float = Form(...),
    phosphorous: float = Form(...),
    potassium: float = Form(...)
):
    try:
        data = CustomData(
            Temperature=temperature,
            Humidity=humidity,
            Moisture=moisture,
            Crop_Type=crop_type,
            Soil_Type=soil_type,
            Nitrogen=nitrogen,
            Phosphorous=phosphorous,
            Potassium=potassium
        )

        pref_df = data.get_data_as_data_frame()
        predict_pipeline = PredictPipeline()
        results = predict_pipeline.predict(pref_df)
        steps = predict_pipeline.rag_predict()

        return {
            "prediction": str(results),
            "rag_steps": steps
        }

    except Exception as e:
        return {"error": str(e)}

# RAG info endpoint
@app.get("/rag_info")
def rag_info():
    try:
        predict_pipeline = PredictPipeline()
        steps = predict_pipeline.rag_predict()
        return {"rag_steps": steps}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002, reload=True)