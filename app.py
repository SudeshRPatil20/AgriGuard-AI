from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from src.pipeline.prediction_pipeline import CustomData, PredictPipeline

# Create FastAPI app
app = FastAPI(title="Fertilizer Prediction API")

# ✅ Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this later to ["http://localhost:5173", "https://yourapp.onrender.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root endpoint (for testing)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Fertilizer Prediction API"}

# ✅ Prediction endpoint
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
        # Prepare input data
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

        # Convert to DataFrame
        pref_df = data.get_data_as_data_frame()

        # Run prediction pipeline
        predict_pipeline = PredictPipeline()
        results = predict_pipeline.predict(pref_df)
        steps = predict_pipeline.rag_predict()

        # Send response
        return {
            "prediction": str(results),
            "rag_steps": steps
        }

    except Exception as e:
        return {"error": str(e)}

# ✅ RAG Info endpoint
@app.get("/rag_info")
def rag_info():
    try:
        predict_pipeline = PredictPipeline()
        steps = predict_pipeline.rag_predict()
        return {"rag_steps": steps}
    except Exception as e:
        return {"error": str(e)}

# ✅ Entry point for Render or local
if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))  # Render automatically provides PORT
    uvicorn.run(app, host="0.0.0.0", port=port)

make this in proper
 sturcture
