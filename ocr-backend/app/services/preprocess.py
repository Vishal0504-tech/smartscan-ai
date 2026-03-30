import cv2
import numpy as np

def preprocess_image(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # OPTIONAL preprocessing (safe for PaddleOCR)
    img = cv2.resize(img, None, fx=1.2, fy=1.2)

    return img   # ✅ return COLOR image (3 channels)