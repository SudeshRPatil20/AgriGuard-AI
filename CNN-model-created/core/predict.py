import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image
import cv2
import os
# CUstom CNN Archetecture
import torch.nn as nn
import torch.optim as optim

class CustomeCnnModel(nn.Module):
    def __init__(self, input_dim, num_classes):
        super(CustomeCnnModel, self).__init__()
        self.input_dim=input_dim
        self.num_classes=num_classes

        self.Conv_layers=nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(32, 64, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(64, 128, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2),

            nn.Conv2d(128, 256, kernel_size=3, stride=1, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(),
            nn.MaxPool2d(kernel_size=2, stride=2)
        )

        self._to_linear = None
        self._get_conv_output(self.input_dim)

        self.fc_layers=nn.Sequential(
            nn.Linear(self._to_linear, 512),
            nn.ReLU(),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Linear(128, self.num_classes),
        )

    def _get_conv_output(self, input_dim=128):
        with torch.no_grad():
            dummy_input=torch.zeros(1, 3, input_dim, input_dim)
            output=self.Conv_layers(dummy_input)
            self._to_linear = output.view(1, -1).size(1)

    def forward(self, x):
        x = self.Conv_layers(x)
        x = x.view(x.size(0), -1)
        x = self.fc_layers(x)
        return x

class ImageClassifier():
    
    def __init__(self, model_path, class_name=None):
        self.device=torch.device("Cuda" if torch.cuda.is_available() else "cpu")
        self.model = CustomeCnnModel(input_dim=128, num_classes=23).to(self.device)
        self.model.load_state_dict(torch.load(model_path, map_location = self.device))
        self.model.eval()
        
        if class_name is None:
            self.class_name = {0: 'Tomato_Early_blight', 1: 'Tomato_Septoria_leaf_spot', 2: 'Tomato_healthy', 3: 'Pepper__bell___Bacterial_spot', 4: 'Tomato_Spider_mites_Two_spotted_spider_mite', 5: 'Pepper__bell___healthy', 6: 'Tomato__Tomato_YellowLeaf__Curl_Virus', 7: 'Apple___healthy', 8: 'Tomato_Leaf_Mold', 9: 'Potato___Late_blight', 10: 'Corn_(maize)___Common_rust_', 11: 'Corn_(maize)___healthy', 12: 'Apple___Black_rot', 13: 'Potato___Early_blight', 14: 'Apple___Apple_scab', 15: 'Apple___Cedar_apple_rust', 16: 'Corn_(maize)___Northern_Leaf_Blight', 17: 'Tomato_Late_blight', 18: 'Tomato__Target_Spot', 19: 'Potato___healthy', 20: 'Tomato_Bacterial_spot', 21: 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 22: 'Tomato__Tomato_mosaic_virus'}
        else:
            self.class_name = class_name
        
        self.transform=transforms.Compose([
        transforms.Resize((128, 128)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])]
        )
        
        
        
        
    #define ccn archetecture
    #load cnn 
    #index to lable
    #transformations
    # CNN Archetecture 
    #CNN()
    #CNN load_dict()
    
    def predict(self, image_path):
        image = Image.open(image_path).convert("RGB")
        image_tensor=self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output=self.model(image_tensor)
            _, predicted = torch.max(output, 1)
            
        labels= self.class_name[predicted.item()]
        
        img = cv2.imread(image_path)
        cv2.putText(img, labels, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
        output_path = "labled_image.jpg"
        cv2.imwrite(output_path, img)
        cwd=os.getcwd()
        output_path = os.path.join(cwd, output_path)
        
        return labels, output_path 