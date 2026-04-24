# train_image.py
# Fine-tunes EfficientNet-B0 on your 5-class Indian civic issue dataset

import os
import torch
import shutil
from torch import nn, optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from sklearn.metrics import accuracy_score
from tqdm import tqdm

# -------- CONFIG --------
DATA_DIR = "dataset/images"
MODEL_OUT = "models/efficientnet/best_model.pth"
LABELS_OUT = "models/efficientnet/labels.txt"
BATCH_SIZE = 16
EPOCHS = 10
LR = 0.0003
IMG_SIZE = 224

# -------- TRANSFORMS --------
train_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ToTensor(),
])

val_tf = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
])

# -------- LOAD DATA --------
train_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=train_tf)
val_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=val_tf)
test_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "test"), transform=val_tf)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)
test_loader = DataLoader(test_ds, batch_size=BATCH_SIZE, shuffle=False)

classes = train_ds.classes
print("Classes:", classes)

# Save label order
os.makedirs("models/efficientnet", exist_ok=True)
with open(LABELS_OUT, "w") as f:
    for c in classes:
        f.write(c + "\n")

# -------- MODEL --------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using:", device)

model = models.efficientnet_b0(weights="IMAGENET1K_V1")
model.classifier[1] = nn.Linear(model.classifier[1].in_features, len(classes))
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

best_val_accuracy = 0.0

# -------- TRAINING LOOP --------
for epoch in range(EPOCHS):
    print(f"\nEPOCH {epoch+1}/{EPOCHS}")

    # TRAIN
    model.train()
    total_loss = 0
    for imgs, labels in tqdm(train_loader):
        imgs, labels = imgs.to(device), labels.to(device)
        optimizer.zero_grad()
        out = model(imgs)
        loss = criterion(out, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(f"Train Loss: {total_loss/len(train_loader):.4f}")

    # VALIDATION
    model.eval()
    preds, gts = [], []
    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs, labels = imgs.to(device), labels.to(device)
            out = model(imgs)
            pred = torch.argmax(out, dim=1)
            preds.extend(pred.cpu().numpy())
            gts.extend(labels.cpu().numpy())

    val_acc = accuracy_score(gts, preds)
    print(f"Validation Accuracy: {val_acc:.4f}")

    # Save best model
    if val_acc > best_val_accuracy:
        best_val_accuracy = val_acc
        torch.save(model.state_dict(), MODEL_OUT)
        print("Saved BEST model!")

print("\nTraining complete.")
print("Best Validation Accuracy:", best_val_accuracy)

# -------- FINAL TEST ACCURACY --------
model.load_state_dict(torch.load(MODEL_OUT))
model.eval()

preds, gts = [], []
with torch.no_grad():
    for imgs, labels in test_loader:
        imgs, labels = imgs.to(device), labels.to(device)
        out = model(imgs)
        pred = torch.argmax(out, dim=1)
        preds.extend(pred.cpu().numpy())
        gts.extend(labels.cpu().numpy())

test_acc = accuracy_score(gts, preds)
print("FINAL TEST ACCURACY:", test_acc)
