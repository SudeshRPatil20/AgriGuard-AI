import gradio as gr
import os
from core.predict import ImageClassifier
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai
from deep_translator import GoogleTranslator

# Load environment variables
load_dotenv()
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

# Load CNN model
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

# Translate if user selected Hindi
def translate_solution(text, language):
    if language == "Hindi":
        return GoogleTranslator(source='auto', target='hi').translate(text)
    return text

# Get disease solution from LLM
def get_disease_solution(disease_name, language):
    prompt = f"I detected a plant disease named '{disease_name}'. Please suggest a suitable organic or chemical treatment, prevention tips, and fertilizers."
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    solution = response.text.strip()
    return translate_solution(solution, language)

# Main prediction pipeline
def classify_image(image, language):
    image_path = "uploaded_image.jpg"
    image.save(image_path)

    label, output_path = classifier.predict(image_path=image_path)
    solution = get_disease_solution(label, language)
    return label, Image.open(output_path), solution

# UI
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Image(value="https://cdn-icons-png.flaticon.com/512/2917/2917999.png", width=100)
    gr.Markdown(
        """
        # 🌿 Plant Health AI Assistant  
        Upload a plant leaf to detect diseases and receive expert treatment powered by Generative AI.
        """, elem_id="title"
    )

    with gr.Row():
        with gr.Column(scale=1):
            image_input = gr.Image(type="pil", label="📷 Upload Plant Leaf Image")
            lang_choice = gr.Radio(["English", "Hindi"], label="🌐 Output Language", value="English")
            submit_btn = gr.Button("🩺 Diagnose & Suggest Treatment", variant="primary")

        with gr.Column(scale=1):
            prediction_text = gr.Textbox(label="🦠 Detected Disease", interactive=False, show_copy_button=True)
            output_image = gr.Image(label="📍 Marked Disease Image")
            with gr.Accordion("💡 AI Doctor's Treatment Plan", open=True):
                solution_box = gr.Textbox(lines=12, label="Suggested Cure", interactive=False, show_copy_button=True)

    gr.Examples(
        examples=["sample_leaf.jpg"],
        inputs=[image_input],
        label="📁 Try with Example Image"
    )

    submit_btn.click(fn=classify_image, inputs=[image_input, lang_choice], outputs=[prediction_text, output_image, solution_box])

# Run
if __name__ == "__main__":
    demo.launch()
