import os
import torch
from torch import nn
from torchvision import transforms, models
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS

# -----------------------------
# Flask Setup
# -----------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Labels
# -----------------------------
LABEL_PATH = "models/efficientnet/labels.txt"

with open(LABEL_PATH, "r") as f:
    LABELS = [line.strip() for line in f.readlines()]

NUM_CLASSES = len(LABELS)
print("Loaded Labels:", LABELS)

# -----------------------------
# Load EfficientNet Model
# -----------------------------
MODEL_PATH = "models/efficientnet/best_model.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = models.efficientnet_b0(weights=None)
model.classifier[1] = nn.Linear(model.classifier[1].in_features, NUM_CLASSES)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()
model.to(device)

# -----------------------------
# Image Transform
# -----------------------------
img_tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict_image(img_path):
    img = Image.open(img_path).convert("RGB")
    img = img_tf(img).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(img)
        probs = torch.softmax(outputs, dim=1)[0]

    confidence, idx = torch.max(probs, dim=0)
    return LABELS[idx.item()], float(confidence.item())

# -----------------------------
# TEXT MODEL PLACEHOLDER (Later DistilBERT)
# -----------------------------
@app.route("/predict/text", methods=["POST"])
def predict_text():
    text = request.json.get("text", "").lower()

    # Simple rule-based fallback (until DistilBERT training)
    mapping = {
        "pothole": "pothole",
        "garbage": "garbage",
        "trash": "garbage",
        "dump": "garbage",
        "waterlog": "waterlogging",
        "flood": "waterlogging",
        "streetlight": "streetlight",
        "lamp": "streetlight",
    }
    
    for k, v in mapping.items():
        if k in text:
            return jsonify({"predicted": v, "confidence": 0.55})

    return jsonify({"predicted": "other", "confidence": 0.40})

# -----------------------------
# IMAGE PREDICTION API
# -----------------------------
@app.route("/predict/image", methods=["POST"])
def predict_image_api():
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400
    
    file = request.files["file"]
    save_path = "temp_upload.jpg"
    file.save(save_path)

    label, confidence = predict_image(save_path)
    os.remove(save_path)

    return jsonify({
        "predicted": label,
        "confidence": confidence
    })

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
