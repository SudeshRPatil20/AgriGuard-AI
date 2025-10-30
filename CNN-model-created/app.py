from fastapi import FastAPI, UploadFile, Form
from fastapi.responses import JSONResponse
import os
from PIL import Image
from io import BytesIO
from core.predict import ImageClassifier
from dotenv import load_dotenv
import google.generativeai as genai
from deep_translator import GoogleTranslator
import uvicorn

# --- Setup ---
load_dotenv()
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

app = FastAPI(
    title="🌿 Plant Health AI Assistant API",
    description="Detects plant diseases and suggests treatments using CNN + Gemini AI.",
    version="1.0.0"
)

# --- Load CNN model ---
cwd = os.getcwd()
model_path = os.path.join(cwd, "model", "cnn_model.pth")

class_name = {
    0: 'Tomato_Early_blight', 1: 'Tomato_Septoria_leaf_spot', 2: 'Tomato_healthy',
    3: 'Pepper__bell___Bacterial_spot', 4: 'Tomato_Spider_mites_Two_spotted_spider_mite',
    5: 'Pepper__bell___healthy', 6: 'Tomato__Tomato_YellowLeaf__Curl_Virus',
    7: 'Apple___healthy', 8: 'Tomato_Leaf_Mold', 9: 'Potato___Late_blight',
    10: 'Corn_(maize)___Common_rust_', 11: 'Corn_(maize)___healthy', 12: 'Apple___Black_rot',
    13: 'Potato___Early_blight', 14: 'Apple___Apple_scab', 15: 'Apple___Cedar_apple_rust',
    16: 'Corn_(maize)___Northern_Leaf_Blight', 17: 'Tomato_Late_blight',
    18: 'Tomato__Target_Spot', 19: 'Potato___healthy', 20: 'Tomato_Bacterial_spot',
    21: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 22: 'Tomato__Tomato_mosaic_virus'
}

classifier = ImageClassifier(model_path=model_path, class_name=class_name)


# --- Helpers ---
def translate_solution(text, language: str):
    """Translate the solution text if Hindi selected."""
    if language.lower() == "hindi":
        return GoogleTranslator(source='auto', target='hi').translate(text)
    return text


def get_disease_solution(disease_name: str, language: str):
    """Use Gemini AI to get treatment solution."""
    prompt = f"I detected a plant disease named '{disease_name}'. Suggest a suitable organic or chemical treatment, prevention tips, and fertilizers."
    model = genai.GenerativeModel("gemini-flash-latest")
    response = model.generate_content(prompt)
    solution = response.text.strip()
    return translate_solution(solution, language)


# --- API Endpoint ---
@app.post("/classify_image")
async def classify_image(image: UploadFile, language: str = Form("English")):
    """
    Upload a plant leaf image and get:
    - Disease name
    - Marked image path
    - AI-based treatment suggestion
    """
    try:
        # Read image
        contents = await image.read()
        pil_image = Image.open(BytesIO(contents))
        image_path = "uploaded_image.jpg"
        pil_image.save(image_path)

        # Predict using CNN
        label, output_path = classifier.predict(image_path=image_path)

        # Get AI solution
        solution = get_disease_solution(label, language)

        # Response
        return JSONResponse({
            "disease": label,
            "solution": solution,
            "marked_image": output_path
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


# --- Optional: Fertilizer API ---
# from pydantic import BaseModel
# import requests
#
# class FertilizerInput(BaseModel):
#     temperature: float
#     humidity: float
#     moisture: float
#     crop_type: str
#     soil_type: str
#     nitrogen: float
#     phosphorous: float
#     potassium: float
#
# @app.post("/fertilizer")
# async def get_fertilizer(data: FertilizerInput):
#     """Forward request to fertilizer FastAPI (if running separately)."""
#     try:
#         url = "http://127.0.0.1:8000/prediction"
#         response = requests.post(url, data=data.dict())
#         return response.json()
#     except Exception as e:
#         return {"error": str(e)}


# --- Run ---
if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=10000)
