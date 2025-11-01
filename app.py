from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from src.pipeline.prediction_pipeline import CustomData, PredictPipeline

app = FastAPI(title="Fertilizer Prediction API")

# ✅ Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://agriguard-ai.vercel.app",
        "https://agriguard-ai-1.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Fertilizer Prediction API"}

# ✅ Original endpoint
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

        return {"prediction": str(results), "rag_steps": steps}

    except Exception as e:
        return {"error": str(e)}

# ✅ Alias endpoint so frontend can use /predict
@app.post("/predict")
def predict_alias(
    temperature: float = Form(...),
    humidity: float = Form(...),
    moisture: float = Form(...),
    crop_type: str = Form(...),
    soil_type: str = Form(...),
    nitrogen: float = Form(...),
    phosphorous: float = Form(...),
    potassium: float = Form(...)
):
    return predict_datapoint(
        temperature=temperature,
        humidity=humidity,
        moisture=moisture,
        crop_type=crop_type,
        soil_type=soil_type,
        nitrogen=nitrogen,
        phosphorous=phosphorous,
        potassium=potassium
    )

@app.get("/rag_info")
def rag_info():
    try:
        predict_pipeline = PredictPipeline()
        steps = predict_pipeline.rag_predict()
        return {"rag_steps": steps}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
